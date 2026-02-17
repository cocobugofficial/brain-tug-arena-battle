import { useState, useEffect, useCallback } from 'react';

const LEADERBOARD_KEY = 'tug_war_leaderboard';

export interface MatchRecord {
  id: string;
  date: string;
  mode: 'pvp' | 'ai' | 'tournament';
  difficulty: string;
  aiDifficulty?: string;
  winner: 1 | 2 | null;
  player1Score: number;
  player2Score: number;
  coinsEarned: number;
  totalQuestions: number;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalCoinsEarned: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  tournamentGames: number;
  tournamentWins: number;
  tournamentBestScore: number;
  aiGames: number;
  aiWins: number;
  recentMatches: MatchRecord[];
}

function calcStats(matches: MatchRecord[]): PlayerStats {
  const totalGames = matches.length;
  const wins = matches.filter(m => m.winner === 1).length;
  const losses = matches.filter(m => m.winner === 2).length;
  const draws = matches.filter(m => m.winner === null).length;
  const totalCoinsEarned = matches.reduce((sum, m) => sum + m.coinsEarned, 0);
  const totalCorrectAnswers = matches.reduce((sum, m) => sum + m.player1Score, 0);

  const tournamentMatches = matches.filter(m => m.mode === 'tournament');
  const aiMatches = matches.filter(m => m.mode === 'ai');

  return {
    totalGames,
    wins,
    losses,
    draws,
    winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
    totalCoinsEarned,
    totalCorrectAnswers,
    bestStreak: 0, // Could be tracked in-game later
    tournamentGames: tournamentMatches.length,
    tournamentWins: tournamentMatches.filter(m => m.winner === 1).length,
    tournamentBestScore: tournamentMatches.reduce((best, m) => Math.max(best, m.player1Score), 0),
    aiGames: aiMatches.length,
    aiWins: aiMatches.filter(m => m.winner === 1).length,
    recentMatches: [...matches].reverse().slice(0, 20),
  };
}

export function useLeaderboard() {
  const [matches, setMatches] = useState<MatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (m: any) => m && typeof m.id === 'string' && typeof m.date === 'string' && typeof m.player1Score === 'number'
          );
        }
      }
    } catch { /* corrupted data */ }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(matches));
  }, [matches]);

  const recordMatch = useCallback((record: Omit<MatchRecord, 'id' | 'date'>) => {
    const newRecord: MatchRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setMatches(prev => [...prev, newRecord]);
  }, []);

  const clearHistory = useCallback(() => {
    setMatches([]);
  }, []);

  const stats = calcStats(matches);

  return { matches, stats, recordMatch, clearHistory };
}
