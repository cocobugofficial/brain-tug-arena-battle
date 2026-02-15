import { motion } from 'framer-motion';
import { Background } from '@/types/game';

interface RopeArenaProps {
  ropePosition: number;
  player1Emoji: string;
  player2Emoji: string;
  player1Frozen: boolean;
  player2Frozen: boolean;
  currentPlayer: 1 | 2;
  background: Background;
}

const BG_GRADIENTS: Record<Background, string> = {
  stadium: 'from-[hsl(210,60%,30%)] via-[hsl(210,50%,45%)] to-[hsl(150,40%,35%)]',
  school: 'from-[hsl(35,40%,40%)] via-[hsl(35,35%,55%)] to-[hsl(45,50%,70%)]',
  home: 'from-[hsl(25,50%,50%)] via-[hsl(30,45%,60%)] to-[hsl(40,55%,75%)]',
};

const BG_LABELS: Record<Background, string> = {
  stadium: '🏟️ Stadium',
  school: '🏫 School',
  home: '🏠 Home',
};

export default function RopeArena({
  ropePosition,
  player1Emoji,
  player2Emoji,
  player1Frozen,
  player2Frozen,
  currentPlayer,
  background,
}: RopeArenaProps) {
  const ropeLeft = `${ropePosition}%`;

  return (
    <div className={`relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-r ${BG_GRADIENTS[background]} shadow-cartoon-lg`}>
      {/* Background label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-body opacity-60 text-primary-foreground">
        {BG_LABELS[background]}
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-[hsl(30,40%,25%)] to-[hsl(100,30%,35%)] rounded-t-3xl" />

      {/* Center line */}
      <div className="absolute left-1/2 bottom-16 w-0.5 h-20 bg-primary-foreground/20" />

      {/* Rope */}
      <div className="absolute bottom-24 w-full px-8">
        <div className="relative h-3 bg-game-rope/30 rounded-full">
          <motion.div
            className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-game-player1 via-game-rope to-game-player2"
            style={{ width: '100%' }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Knot indicator */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-card border-2 border-foreground/30 shadow-cartoon"
            animate={{ left: ropeLeft }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ marginLeft: '-10px' }}
          />
        </div>
      </div>

      {/* Player 1 */}
      <motion.div
        className={`absolute bottom-16 text-4xl sm:text-5xl ${player1Frozen ? 'animate-freeze' : ''} ${currentPlayer === 1 ? 'animate-pulse-glow' : ''}`}
        animate={{
          left: `${Math.max(2, ropePosition - 15)}%`,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="flex flex-col items-center">
          <span className="drop-shadow-lg">{player1Emoji}</span>
          <span className="text-[10px] font-display text-primary-foreground mt-1">P1</span>
          {player1Frozen && (
            <span className="text-xs text-primary-foreground bg-primary/50 px-1 rounded">❄️ Frozen!</span>
          )}
        </div>
      </motion.div>

      {/* Player 2 */}
      <motion.div
        className={`absolute bottom-16 text-4xl sm:text-5xl ${player2Frozen ? 'animate-freeze' : ''} ${currentPlayer === 2 ? 'animate-pulse-glow' : ''}`}
        animate={{
          left: `${Math.min(88, ropePosition + 10)}%`,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="flex flex-col items-center">
          <span className="drop-shadow-lg transform scale-x-[-1] inline-block">{player2Emoji}</span>
          <span className="text-[10px] font-display text-primary-foreground mt-1">P2</span>
          {player2Frozen && (
            <span className="text-xs text-primary-foreground bg-destructive/50 px-1 rounded">❄️ Frozen!</span>
          )}
        </div>
      </motion.div>

      {/* Progress markers */}
      <div className="absolute bottom-[72px] w-full px-8 flex justify-between">
        {[0, 25, 50, 75, 100].map(mark => (
          <div key={mark} className="w-1 h-2 bg-primary-foreground/30 rounded" />
        ))}
      </div>
    </div>
  );
}
