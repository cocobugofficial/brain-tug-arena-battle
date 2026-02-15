import { motion } from 'framer-motion';
import { MathQuestion } from '@/types/game';

interface QuestionCardProps {
  question: MathQuestion;
  timeLeft: number;
  currentPlayer: 1 | 2;
  onAnswer: (answer: number) => void;
  frozen: boolean;
}

export default function QuestionCard({ question, timeLeft, currentPlayer, onAnswer, frozen }: QuestionCardProps) {
  const isUrgent = timeLeft <= 2;

  return (
    <motion.div
      key={question.id}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Player turn indicator */}
      <div className={`text-center mb-2 font-display text-lg ${currentPlayer === 1 ? 'text-game-player1' : 'text-game-player2'}`}>
        Player {currentPlayer}'s Turn
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-3">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl shadow-cartoon border-4 
          ${isUrgent ? 'border-game-wrong bg-game-wrong/10 text-game-wrong animate-pulse' : 'border-game-timer bg-card text-game-timer'}`}>
          {timeLeft}
        </div>
      </div>

      {/* Question */}
      <div className="bg-card rounded-2xl p-6 shadow-cartoon-lg text-center mb-4">
        <p className="font-display text-3xl sm:text-4xl text-foreground text-stroke">
          {question.question} = ?
        </p>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, i) => (
          <motion.button
            key={`${question.id}_${option}_${i}`}
            whileHover={{ scale: frozen ? 1 : 1.05 }}
            whileTap={{ scale: frozen ? 1 : 0.95 }}
            onClick={() => !frozen && onAnswer(option)}
            disabled={frozen}
            className={`py-4 px-6 rounded-xl font-display text-xl shadow-cartoon transition-colors
              ${frozen
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : currentPlayer === 1
                  ? 'bg-primary text-primary-foreground hover:brightness-110 active:shadow-none'
                  : 'bg-destructive text-destructive-foreground hover:brightness-110 active:shadow-none'
              }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {frozen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-3 font-display text-game-wrong text-lg"
        >
          ❄️ Frozen! Wait...
        </motion.div>
      )}
    </motion.div>
  );
}
