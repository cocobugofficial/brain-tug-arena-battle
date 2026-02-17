import { useState, useEffect } from 'react';
import { CharacterSkin, SKINS } from '@/types/game';

const STORAGE_KEY = 'tug_war_coins';
const SKINS_KEY = 'tug_war_skins';
const SELECTED_KEY = 'tug_war_selected_skins';

export function useCoins() {
  const [coins, setCoins] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
      }
    } catch { /* corrupted data */ }
    return 0;
  });

  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SKINS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(s => typeof s === 'string')) {
          return parsed.includes('default') ? parsed : ['default', ...parsed];
        }
      }
    } catch { /* corrupted data */ }
    return ['default'];
  });

  const [selectedSkins, setSelectedSkins] = useState<{ p1: string; p2: string }>(() => {
    try {
      const saved = localStorage.getItem(SELECTED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.p1 === 'string' && typeof parsed.p2 === 'string') {
          return parsed;
        }
      }
    } catch { /* corrupted data */ }
    return { p1: 'default', p2: 'default' };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(SKINS_KEY, JSON.stringify(unlockedSkins));
  }, [unlockedSkins]);

  useEffect(() => {
    localStorage.setItem(SELECTED_KEY, JSON.stringify(selectedSkins));
  }, [selectedSkins]);

  const addCoins = (amount: number) => setCoins(prev => prev + amount);

  const buySkin = (skinId: string): boolean => {
    const skin = SKINS.find(s => s.id === skinId);
    if (!skin || unlockedSkins.includes(skinId) || coins < skin.cost) return false;
    setCoins(prev => prev - skin.cost);
    setUnlockedSkins(prev => [...prev, skinId]);
    return true;
  };

  const selectSkin = (player: 1 | 2, skinId: string) => {
    if (!unlockedSkins.includes(skinId)) return;
    setSelectedSkins(prev =>
      player === 1 ? { ...prev, p1: skinId } : { ...prev, p2: skinId }
    );
  };

  const getSkin = (skinId: string): CharacterSkin => {
    return SKINS.find(s => s.id === skinId) || SKINS[0];
  };

  return { coins, addCoins, unlockedSkins, buySkin, selectedSkins, selectSkin, getSkin };
}
