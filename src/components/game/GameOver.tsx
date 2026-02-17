import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playMudSplashSound, playVictoryFanfare } from '@/utils/sounds';

interface GameOverProps {
  winner: 1 | 2 | null;
  player1Score: number;
  player2Score: number;
  coinsEarned: number;
  isTournament: boolean;
  onRestart: () => void;
  onMenu: () => void;
  player1Emoji?: string;
  player2Emoji?: string;
}

function MudPunishment({ emoji }: { emoji: string }) {
  useEffect(() => {
    const timer = setTimeout(() => playMudSplashSound(), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex justify-center my-4">
      <div className="relative w-48 h-28">
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-[hsl(30,50%,20%)] to-[hsl(30,60%,35%)] rounded-[50%] shadow-inner" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[hsl(30,55%,30%)]"
            style={{
              width: 8 + Math.random() * 12,
              height: 8 + Math.random() * 12,
              left: `${20 + Math.random() * 60}%`,
              bottom: 32,
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{
              y: [0, -40 - Math.random() * 40, 10],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.3],
            }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-5xl z-10"
          initial={{ y: -120, rotate: 0 }}
          animate={{ y: [null, -20, 8], rotate: [0, 180, 360] }}
          transition={{ duration: 0.7, ease: [0.45, 0, 0.55, 1], times: [0, 0.7, 1] }}
        >
          {emoji}
        </motion.div>

        {[0, 1, 2].map(i => (
          <motion.div
            key={`ring-${i}`}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 border-2 border-[hsl(30,40%,30%)] rounded-full"
            initial={{ width: 10, height: 5, opacity: 0 }}
            animate={{ width: [10, 80 + i * 30], height: [5, 20 + i * 8], opacity: [0, 0.6, 0] }}
            transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
          />
        ))}

        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-xl text-[hsl(30,60%,35%)] whitespace-nowrap"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.8], y: [20, -10, -10, -30] }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          💥 SPLAT!
        </motion.div>
      </div>
    </div>
  );
}

function VictoryCelebration({ emoji }: { emoji: string }) {
  useEffect(() => {
    playVictoryFanfare();

    // Confetti bursts
    const fire = (opts: confetti.Options) =>
      confetti({ ...opts, disableForReducedMotion: true });

    fire({ particleCount: 60, spread: 70, origin: { x: 0.3, y: 0.6 } });
    setTimeout(() => fire({ particleCount: 60, spread: 70, origin: { x: 0.7, y: 0.6 } }), 200);
    setTimeout(() => fire({ particleCount: 40, spread: 100, origin: { x: 0.5, y: 0.5 }, colors: ['#FFD700', '#FFA500', '#FF6347'] }), 500);
    setTimeout(() => fire({ particleCount: 30, spread: 120, origin: { x: 0.5, y: 0.4 } }), 800);
  }, []);

  return (
    <div className="relative flex flex-col items-center my-3">
      {/* Glowing stars around winner */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + (i % 2) * 30}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1.2, 0.8, 1.2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2, delay: 0.3 + i * 0.15, repeat: Infinity, repeatDelay: 1 }}
        >
          ⭐
        </motion.div>
      ))}

      {/* Winner bouncing */}
      <motion.div
        className="text-6xl z-10"
        animate={{
          y: [0, -15, 0, -10, 0],
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
      >
        {emoji}
      </motion.div>

      {/* Crown */}
      <motion.div
        className="text-3xl -mt-2"
        initial={{ y: -40, opacity: 0, scale: 0 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.3 }}
      >
        👑
      </motion.div>

      <motion.p
        className="font-display text-lg text-primary mt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        🎉 Champion! 🎉
      </motion.p>
    </div>
  );
}

export default function GameOver({ winner, player1Score, player2Score, coinsEarned, isTournament, onRestart, onMenu, player1Emoji = '🧑', player2Emoji = '🧑' }: GameOverProps) {
  const loserEmoji = winner === 1 ? player2Emoji : winner === 2 ? player1Emoji : null;
  const winnerEmoji = winner === 1 ? player1Emoji : winner === 2 ? player2Emoji : null;
  const showMudPunishment = isTournament && winner !== null && loserEmoji;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
    >
      <div className="bg-card rounded-3xl p-8 shadow-cartoon-lg text-center max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="text-6xl mb-2">🏆</div>
        <h2 className="font-display text-3xl text-foreground mb-2">
          {winner ? `Player ${winner} Wins!` : "It's a Draw!"}
        </h2>
        <p className="text-muted-foreground font-body mb-2">
          {isTournament ? 'Tournament Complete!' : 'Great game!'}
        </p>

        {/* Winner celebration */}
        {winner !== null && winnerEmoji && (
          <VictoryCelebration emoji={winnerEmoji} />
        )}

        {/* Mud punishment for tournament loser */}
        {showMudPunishment && (
          <div>
            <p className="font-display text-sm text-destructive mb-1">
              Player {winner === 1 ? 2 : 1} falls in the mud! 😱
            </p>
            <MudPunishment emoji={loserEmoji} />
          </div>
        )}

        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <div className="font-display text-primary text-sm">P1</div>
            <div className="font-display text-2xl">{player1Score}</div>
          </div>
          <div className="text-center">
            <div className="font-display text-destructive text-sm">P2</div>
            <div className="font-display text-2xl">{player2Score}</div>
          </div>
        </div>

        <div className="bg-game-coin/20 rounded-xl p-3 mb-6">
          <span className="font-display text-lg">🪙 +{coinsEarned} coins earned!</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl font-display text-lg bg-primary text-primary-foreground shadow-cartoon hover:brightness-110 transition"
          >
            Play Again
          </button>
          <button
            onClick={onMenu}
            className="flex-1 py-3 rounded-xl font-display text-lg bg-secondary text-secondary-foreground shadow-cartoon hover:brightness-110 transition"
          >
            Menu
          </button>
        </div>
      </div>
    </motion.div>
  );
}
