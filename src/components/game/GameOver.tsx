import { motion } from 'framer-motion';

interface GameOverProps {
  winner: 1 | 2 | null;
  player1Score: number;
  player2Score: number;
  coinsEarned: number;
  isTournament: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export default function GameOver({ winner, player1Score, player2Score, coinsEarned, isTournament, onRestart, onMenu }: GameOverProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
    >
      <div className="bg-card rounded-3xl p-8 shadow-cartoon-lg text-center max-w-sm w-full">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="font-display text-3xl text-foreground mb-2">
          {winner ? `Player ${winner} Wins!` : "It's a Draw!"}
        </h2>
        <p className="text-muted-foreground font-body mb-4">
          {isTournament ? 'Tournament Complete!' : 'Great game!'}
        </p>

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
