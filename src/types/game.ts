export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathQuestion {
  id: string;
  question: string;
  answer: number;
  options: number[];
  difficulty: Difficulty;
}

export interface CharacterSkin {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  unlocked: boolean;
}

export interface GameState {
  ropePosition: number; // 0-100, 50 is center
  currentPlayer: 1 | 2;
  player1Score: number;
  player2Score: number;
  player1Streak: number;
  player2Streak: number;
  player1WrongStreak: number;
  player2WrongStreak: number;
  player1Frozen: boolean;
  player2Frozen: boolean;
  currentQuestion: MathQuestion | null;
  timeLeft: number;
  gameOver: boolean;
  winner: 1 | 2 | null;
  difficulty: Difficulty;
  usedQuestionIds: Set<string>;
  isTournament: boolean;
  tournamentQuestionsLeft: number;
  tournamentCoinsEarned: number;
}

export type Background = 'stadium' | 'school' | 'home';

export const SKINS: CharacterSkin[] = [
  { id: 'default', name: 'Default', emoji: '🧑', cost: 0, unlocked: true },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', cost: 50, unlocked: false },
  { id: 'robot', name: 'Robot', emoji: '🤖', cost: 100, unlocked: false },
  { id: 'alien', name: 'Alien', emoji: '👽', cost: 150, unlocked: false },
  { id: 'wizard', name: 'Wizard', emoji: '🧙', cost: 200, unlocked: false },
  { id: 'astronaut', name: 'Astronaut', emoji: '🧑‍🚀', cost: 300, unlocked: false },
  { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', cost: 250, unlocked: false },
  { id: 'superhero', name: 'Superhero', emoji: '🦸', cost: 400, unlocked: false },
];
