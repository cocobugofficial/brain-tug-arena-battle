import { SKINS } from '@/types/game';
import { motion } from 'framer-motion';

interface SkinShopProps {
  coins: number;
  unlockedSkins: string[];
  selectedSkins: { p1: string; p2: string };
  onBuy: (skinId: string) => boolean;
  onSelect: (player: 1 | 2, skinId: string) => void;
  onBack: () => void;
}

export default function SkinShop({ coins, unlockedSkins, selectedSkins, onBuy, onSelect, onBack }: SkinShopProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-4"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="font-display text-lg text-primary hover:underline">
          ← Back
        </button>
        <div className="font-display text-lg flex items-center gap-1">
          🪙 {coins}
        </div>
      </div>

      <h2 className="font-display text-3xl text-center mb-6 text-foreground">🎨 Skin Shop</h2>

      <div className="grid grid-cols-2 gap-3">
        {SKINS.map(skin => {
          const owned = unlockedSkins.includes(skin.id);
          const selectedP1 = selectedSkins.p1 === skin.id;
          const selectedP2 = selectedSkins.p2 === skin.id;
          const canAfford = coins >= skin.cost;

          return (
            <div
              key={skin.id}
              className={`bg-card rounded-2xl p-4 shadow-cartoon text-center border-2 transition
                ${selectedP1 ? 'border-primary' : selectedP2 ? 'border-destructive' : 'border-transparent'}`}
            >
              <div className="text-4xl mb-2">{skin.emoji}</div>
              <div className="font-display text-sm text-foreground">{skin.name}</div>

              {owned ? (
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => onSelect(1, skin.id)}
                    className={`flex-1 text-xs py-1 rounded-lg font-body transition
                      ${selectedP1 ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}
                  >
                    P1
                  </button>
                  <button
                    onClick={() => onSelect(2, skin.id)}
                    className={`flex-1 text-xs py-1 rounded-lg font-body transition
                      ${selectedP2 ? 'bg-destructive text-destructive-foreground' : 'bg-destructive/10 text-destructive'}`}
                  >
                    P2
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onBuy(skin.id)}
                  disabled={!canAfford}
                  className={`mt-2 w-full text-xs py-1.5 rounded-lg font-display transition
                    ${canAfford
                      ? 'bg-game-coin text-foreground shadow-cartoon hover:brightness-110'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                >
                  🪙 {skin.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
