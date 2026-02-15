import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Difficulty } from '@/types/game';
import { generateQuestion } from '@/utils/mathGenerator';
import { playCorrectSound, playWrongSound, playWinSound, playTickSound, playFreezeSound, playStreakSound } from '@/utils/sounds';
import confetti from 'canvas-confetti';

const TIMER_DURATION = 5;

function createInitialState(diff: Difficulty, tournament: boolean): GameState {
  const usedIds = new Set<string>();
  const q = generateQuestion(tournament ? 'hard' : diff, usedIds);
  usedIds.add(q.id);
  return {
    ropePosition: 50,
    currentPlayer: 1,
    player1Score: 0,
    player2Score: 0,
    player1Streak: 0,
    player2Streak: 0,
    player1WrongStreak: 0,
    player2WrongStreak: 0,
    player1Frozen: false,
    player2Frozen: false,
    currentQuestion: q,
    timeLeft: TIMER_DURATION,
    gameOver: false,
    winner: null,
    difficulty: diff,
    usedQuestionIds: usedIds,
    isTournament: tournament,
    tournamentQuestionsLeft: tournament ? 20 : 0,
    tournamentCoinsEarned: 0,
  };
}

export function useGameState(difficulty: Difficulty, isTournament: boolean, gameKey: number) {
  const [state, setState] = useState<GameState>(() => createInitialState(difficulty, isTournament));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when gameKey changes
  useEffect(() => {
    setState(createInitialState(difficulty, isTournament));
  }, [gameKey, difficulty, isTournament]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const checkWin = useCallback((pos: number): 1 | 2 | null => {
    if (pos <= 0) return 1;
    if (pos >= 100) return 2;
    return null;
  }, []);

  const nextQuestion = useCallback((st: GameState): GameState => {
    const diff = st.isTournament ? 'hard' : st.difficulty;
    const q = generateQuestion(diff, st.usedQuestionIds);
    const newUsed = new Set(st.usedQuestionIds);
    newUsed.add(q.id);
    const nextPlayer: 1 | 2 = st.currentPlayer === 1 ? 2 : 1;
    return { ...st, currentQuestion: q, timeLeft: TIMER_DURATION, currentPlayer: nextPlayer, usedQuestionIds: newUsed };
  }, []);

  const handleAnswer = useCallback((selectedAnswer: number) => {
    stopTimer();
    setState(prev => {
      if (prev.gameOver || !prev.currentQuestion) return prev;
      const isP1 = prev.currentPlayer === 1;
      if ((isP1 && prev.player1Frozen) || (!isP1 && prev.player2Frozen)) return prev;

      const correct = selectedAnswer === prev.currentQuestion.answer;
      const ns = { ...prev };

      if (correct) {
        playCorrectSound();
        if (isP1) {
          ns.player1Score += 1; ns.player1Streak += 1; ns.player1WrongStreak = 0;
          if (ns.player1Streak >= 3) { ns.ropePosition = 15; ns.player1Streak = 0; playStreakSound(); }
          else { ns.ropePosition = Math.max(0, prev.ropePosition - 10); }
        } else {
          ns.player2Score += 1; ns.player2Streak += 1; ns.player2WrongStreak = 0;
          if (ns.player2Streak >= 3) { ns.ropePosition = 85; ns.player2Streak = 0; playStreakSound(); }
          else { ns.ropePosition = Math.min(100, prev.ropePosition + 10); }
        }
        if (ns.isTournament) { ns.tournamentCoinsEarned += 5; ns.tournamentQuestionsLeft -= 1; }
      } else {
        playWrongSound();
        if (isP1) {
          ns.player1Streak = 0; ns.player1WrongStreak += 1;
          ns.ropePosition = Math.min(100, prev.ropePosition + 5);
          if (ns.player1WrongStreak >= 3) {
            ns.player1Frozen = true; ns.player1WrongStreak = 0; playFreezeSound();
            setTimeout(() => setState(s => ({ ...s, player1Frozen: false })), 2000);
          }
        } else {
          ns.player2Streak = 0; ns.player2WrongStreak += 1;
          ns.ropePosition = Math.max(0, prev.ropePosition - 5);
          if (ns.player2WrongStreak >= 3) {
            ns.player2Frozen = true; ns.player2WrongStreak = 0; playFreezeSound();
            setTimeout(() => setState(s => ({ ...s, player2Frozen: false })), 2000);
          }
        }
        if (ns.isTournament) { ns.tournamentQuestionsLeft -= 1; }
      }

      if (ns.isTournament && ns.tournamentQuestionsLeft <= 0) {
        ns.gameOver = true;
        ns.winner = ns.ropePosition < 50 ? 1 : ns.ropePosition > 50 ? 2 : null;
        playWinSound(); confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        return ns;
      }

      const winner = checkWin(ns.ropePosition);
      if (winner) {
        ns.gameOver = true; ns.winner = winner;
        playWinSound(); confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        return ns;
      }

      return nextQuestion(ns);
    });
  }, [stopTimer, checkWin, nextQuestion]);

  // Timer
  useEffect(() => {
    if (state.gameOver) { stopTimer(); return; }
    stopTimer();
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) return prev;
        if (prev.timeLeft <= 2) playTickSound();
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return stopTimer;
  }, [state.currentQuestion?.id, state.gameOver, stopTimer]);

  useEffect(() => {
    if (state.timeLeft <= 0 && !state.gameOver) {
      handleAnswer(-Infinity);
    }
  }, [state.timeLeft, state.gameOver, handleAnswer]);

  const getCoinsEarned = useCallback((): number => {
    if (state.isTournament) return state.tournamentCoinsEarned;
    const winnerScore = state.winner === 1 ? state.player1Score : state.player2Score;
    return Math.max(5, winnerScore * 2);
  }, [state]);

  return { state, handleAnswer, getCoinsEarned };
}
