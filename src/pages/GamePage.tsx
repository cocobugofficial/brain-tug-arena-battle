import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Difficulty, Background } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useCoins } from '@/hooks/useCoins';
import RopeArena from '@/components/game/RopeArena';
import QuestionCard from '@/components/game/QuestionCard';
import ScoreBoard from '@/components/game/ScoreBoard';
import GameOver from '@/components/game/GameOver';
import SkinShop from '@/components/game/SkinShop';

type Screen = 'menu' | 'game' | 'shop';
const BACKGROUNDS: Background[] = ['stadium', 'school', 'home'];

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isTournament, setIsTournament] = useState(false);
  const [background, setBackground] = useState<Background>('stadium');
  const [gameKey, setGameKey] = useState(0);
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  const { coins, addCoins, unlockedSkins, buySkin, selectedSkins, selectSkin, getSkin } = useCoins();
  const { state, handleAnswer, getCoinsEarned } = useGameState(difficulty, isTournament, gameKey);

  const p1Skin = getSkin(selectedSkins.p1);
  const p2Skin = getSkin(selectedSkins.p2);

  const startGame = useCallback((diff: Difficulty, tournament = false) => {
    setDifficulty(diff);
    setIsTournament(tournament);
    setCoinsAwarded(false);
    setGameKey(k => k + 1);
    setScreen('game');
  }, []);

  // Award coins when game ends
  if (state.gameOver && !coinsAwarded) {
    const earned = getCoinsEarned();
    addCoins(earned);
    setCoinsAwarded(true);
  }

  if (screen === 'shop') {
    return (
      <div className="min-h-screen bg-background p-4">
        <SkinShop coins={coins} unlockedSkins={unlockedSkins} selectedSkins={selectedSkins}
          onBuy={buySkin} onSelect={selectSkin} onBack={() => setScreen('menu')} />
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

          <div className="space-y-3 mb-4">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
              <button key={diff} onClick={() => startGame(diff)}
                className="w-full py-3.5 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 active:shadow-none bg-primary text-primary-foreground">
                {diff === 'easy' ? '😊' : diff === 'medium' ? '🤔' : '🔥'} {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          <button onClick={() => startGame('hard', true)}
            className="w-full py-3.5 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 active:shadow-none bg-secondary text-secondary-foreground mb-3">
            🏆 Tournament (20 Hard Qs)
          </button>

          <div className="flex justify-center gap-2 mb-4">
            {BACKGROUNDS.map(bg => (
              <button key={bg} onClick={() => setBackground(bg)}
                className={`px-3 py-1.5 rounded-lg font-body text-sm shadow-cartoon transition
                  ${background === bg ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-accent/50'}`}>
                {bg === 'stadium' ? '🏟️' : bg === 'school' ? '🏫' : '🏠'} {bg}
              </button>
            ))}
          </div>

          <button onClick={() => setScreen('shop')}
            className="w-full py-3 rounded-xl font-display text-lg shadow-cartoon transition hover:brightness-110 bg-game-coin/20 text-foreground">
            🎨 Skin Shop
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 gap-4">
      <ScoreBoard player1Score={state.player1Score} player2Score={state.player2Score}
        player1Streak={state.player1Streak} player2Streak={state.player2Streak}
        player1Emoji={p1Skin.emoji} player2Emoji={p2Skin.emoji}
        ropePosition={state.ropePosition} isTournament={state.isTournament}
        tournamentQuestionsLeft={state.tournamentQuestionsLeft} coins={coins} />

      <RopeArena ropePosition={state.ropePosition} player1Emoji={p1Skin.emoji} player2Emoji={p2Skin.emoji}
        player1Frozen={state.player1Frozen} player2Frozen={state.player2Frozen}
        currentPlayer={state.currentPlayer} background={background} />

      {state.currentQuestion && !state.gameOver && (
        <QuestionCard question={state.currentQuestion} timeLeft={state.timeLeft}
          currentPlayer={state.currentPlayer} onAnswer={handleAnswer}
          frozen={state.currentPlayer === 1 ? state.player1Frozen : state.player2Frozen} />
      )}

      <button onClick={() => setScreen('menu')}
        className="font-display text-sm text-muted-foreground hover:text-foreground transition">
        ← Back to Menu
      </button>

      {state.gameOver && (
        <GameOver winner={state.winner} player1Score={state.player1Score} player2Score={state.player2Score}
          coinsEarned={getCoinsEarned()} isTournament={state.isTournament}
          onRestart={() => { setCoinsAwarded(false); setGameKey(k => k + 1); }}
          onMenu={() => setScreen('menu')} />
      )}
    </div>
  );
}
