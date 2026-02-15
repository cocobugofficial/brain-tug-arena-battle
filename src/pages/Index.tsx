import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-center"
      >
        <div className="text-8xl mb-4">🪢</div>
        <h1 className="font-display text-5xl sm:text-6xl text-foreground mb-3 text-stroke">
          Tug of War
        </h1>
        <p className="font-display text-2xl text-secondary mb-8">
          Math Battle Arena!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/play')}
          className="px-10 py-4 rounded-2xl font-display text-2xl bg-primary text-primary-foreground shadow-cartoon-lg hover:brightness-110 transition"
        >
          🎮 Play Now!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Index;
