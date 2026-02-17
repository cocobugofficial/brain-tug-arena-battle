import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Difficulty, Background } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useCoins } from '@/hooks/useCoins';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import RopeArena from '@/components/game/RopeArena';
import QuestionCard from '@/components/game/QuestionCard';
import ScoreBoard from '@/components/game/ScoreBoard';
import GameOver from '@/components/game/GameOver';
import SkinShop from '@/components/game/SkinShop';
import Leaderboard from '@/components/game/Leaderboard';

type Screen = 'menu' | 'game' | 'shop' | 'leaderboard';
const BACKGROUNDS: Background[] = ['stadium', 'school', 'home'];

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isTournament, setIsTournament] = useState(false);
  const [background, setBackground] = useState<Background>('stadium');
  const [gameKey, setGameKey] = useState(0);
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>('medium');
  const matchRecordedRef = useRef(false);

  const { coins, addCoins, unlockedSkins, buySkin, selectedSkins, selectSkin, getSkin } = useCoins();
  const { state, handleAnswer, getCoinsEarned } = useGameState(difficulty, isTournament, gameKey, isAI, aiDifficulty);
  const { stats, recordMatch, clearHistory } = useLeaderboard();

  const p1Skin = getSkin(selectedSkins.p1);
  const p2Skin = getSkin(selectedSkins.p2);

  const startGame = useCallback((diff: Difficulty, tournament = false, ai = false) => {
    setDifficulty(diff);
    setIsTournament(tournament);
    setIsAI(ai);
    setCoinsAwarded(false);
    matchRecordedRef.current = false;
    setGameKey(k => k + 1);
    setScreen('game');
  }, []);

  // Award coins and record match when game ends
  if (state.gameOver && !coinsAwarded) {
    const earned = getCoinsEarned();
    addCoins(earned);
    setCoinsAwarded(true);
  }

  useEffect(() => {
    if (state.gameOver && !matchRecordedRef.current) {
      matchRecordedRef.current = true;
      recordMatch({
        mode: isTournament ? 'tournament' : isAI ? 'ai' : 'pvp',
        difficulty,
        aiDifficulty: isAI ? aiDifficulty : undefined,
        winner: state.winner,
        player1Score: state.player1Score,
        player2Score: state.player2Score,
        coinsEarned: getCoinsEarned(),
        totalQuestions: state.player1Score + state.player2Score,
      });
    }
  }, [state.gameOver]);

  if (screen === 'shop') {
    return (
      <div className="min-h-screen bg-background p-4">
        <SkinShop coins={coins} unlockedSkins={unlockedSkins} selectedSkins={selectedSkins}
          onBuy={buySkin} onSelect={selectSkin} onBack={() => setScreen('menu')} />
      </div>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <div className="min-h-screen bg-background p-4">
        <Leaderboard stats={stats} onBack={() => setScreen('menu')} onClear={clearHistory} />
      </div>
    );
  }

  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm text-center">
          <div className="text-6xl mb-2">🪢</div>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-2 text-stroke">Tug of War</h1>
          <p className="font-display text-xl text-secondary mb-1">Math Battle!</p>
          <div className="flex items-center justify-center gap-1 mb-6 text-game-coin font-display">🪙 {coins} coins</div>

          {/* Mode: 2 Player */}
          <div className="mb-2">
            <p className="font-display text-sm text-muted-foreground mb-2">👥 2 Player</p>
            <div className="space-y-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <button key={diff} onClick={() => startGame(diff, false, false)}
                  className="w-full py-3 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 active:shadow-none bg-primary text-primary-foreground">
                  {diff === 'easy' ? '😊' : diff === 'medium' ? '🤔' : '🔥'} {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-display text-sm text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Mode: vs AI */}
          <div className="mb-4">
            <p className="font-display text-sm text-muted-foreground mb-2">🤖 vs AI</p>

            {/* AI Difficulty selector */}
            <div className="flex justify-center gap-2 mb-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(ad => (
                <button key={ad} onClick={() => setAiDifficulty(ad)}
                  className={`px-3 py-1 rounded-lg font-body text-xs shadow-cartoon transition
                    ${aiDifficulty === ad ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-accent/50'}`}>
                  {ad === 'easy' ? '🐣' : ad === 'medium' ? '🧠' : '👹'} AI {ad}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <button key={`ai-${diff}`} onClick={() => startGame(diff, false, true)}
                  className="w-full py-3 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 active:shadow-none bg-destructive text-destructive-foreground">
                  🤖 {diff === 'easy' ? '😊' : diff === 'medium' ? '🤔' : '🔥'} {diff.charAt(0).toUpperCase() + diff.slice(1)} vs AI
                </button>
              ))}
            </div>
          </div>

          {/* Tournament */}
          <button onClick={() => startGame('hard', true, false)}
            className="w-full py-3.5 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 active:shadow-none bg-secondary text-secondary-foreground mb-3">
            🏆 Tournament (20 Hard Qs)
          </button>

          {/* Background selector */}
          <div className="flex justify-center gap-2 mb-4">
            {BACKGROUNDS.map(bg => (
              <button key={bg} onClick={() => setBackground(bg)}
                className={`px-3 py-1.5 rounded-lg font-body text-sm shadow-cartoon transition
                  ${background === bg ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-accent/50'}`}>
                {bg === 'stadium' ? '🏟️' : bg === 'school' ? '🏫' : '🏠'} {bg}
              </button>
            ))}
          </div>

          {/* Bottom buttons */}
          <div className="space-y-2">
            <button onClick={() => setScreen('leaderboard')}
              className="w-full py-3 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 bg-accent/20 text-foreground">
              📊 Leaderboard
            </button>
            <button onClick={() => setScreen('shop')}
              className="w-full py-3 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 bg-game-coin/20 text-foreground">
              🎨 Skin Shop
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game screen
  const isAITurn = isAI && state.currentPlayer === 2 && !state.gameOver;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 gap-4">
      <ScoreBoard player1Score={state.player1Score} player2Score={state.player2Score}
        player1Streak={state.player1Streak} player2Streak={state.player2Streak}
        player1Emoji={p1Skin.emoji} player2Emoji={isAI ? '🤖' : p2Skin.emoji}
        ropePosition={state.ropePosition} isTournament={state.isTournament}
        tournamentQuestionsLeft={state.tournamentQuestionsLeft} coins={coins} />

      <RopeArena ropePosition={state.ropePosition} player1Emoji={p1Skin.emoji} player2Emoji={isAI ? '🤖' : p2Skin.emoji}
        player1Frozen={state.player1Frozen} player2Frozen={state.player2Frozen}
        currentPlayer={state.currentPlayer} background={background} />

      {state.currentQuestion && !state.gameOver && (
        isAITurn ? (
          <motion.div
            key={`ai-thinking-${state.currentQuestion.id}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg mx-auto text-center"
          >
            <div className="text-center mb-2 font-display text-lg text-game-player2">
              🤖 AI is thinking...
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-cartoon-lg text-center mb-4">
              <p className="font-display text-3xl sm:text-4xl text-foreground text-stroke">
                {state.currentQuestion.question} = ?
              </p>
            </div>
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-10 h-10 border-4 border-game-player2 border-t-transparent rounded-full"
              />
            </div>
          </motion.div>
        ) : (
          <QuestionCard question={state.currentQuestion} timeLeft={state.timeLeft}
            currentPlayer={state.currentPlayer} onAnswer={handleAnswer}
            frozen={state.player1Frozen} />
        )
      )}

      <button onClick={() => setScreen('menu')}
        className="font-display text-sm text-muted-foreground hover:text-foreground transition">
        ← Back to Menu
      </button>

      {state.gameOver && (
        <GameOver winner={state.winner} player1Score={state.player1Score} player2Score={state.player2Score}
          coinsEarned={getCoinsEarned()} isTournament={state.isTournament}
          player1Emoji={p1Skin.emoji} player2Emoji={isAI ? '🤖' : p2Skin.emoji}
          onRestart={() => { setCoinsAwarded(false); matchRecordedRef.current = false; setGameKey(k => k + 1); }}
          onMenu={() => setScreen('menu')} />
      )}
    </div>
  );
}
