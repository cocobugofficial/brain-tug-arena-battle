import { MathQuestion, Difficulty } from '@/types/game';

let questionCounter = 0;

function generateId(): string {
  return `q_${++questionCounter}_${Date.now()}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrongs = new Set<number>();
  while (wrongs.size < count) {
    const offset = randomInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);
    const wrong = correct + offset;
    if (wrong !== correct && wrong >= 0) wrongs.add(wrong);
  }
  return [...wrongs];
}

function generateEasy(): { question: string; answer: number } {
  const ops = ['+', '-'] as const;
  const op = ops[randomInt(0, 1)];
  const a = randomInt(1, 20);
  const b = randomInt(1, 20);
  if (op === '+') return { question: `${a} + ${b}`, answer: a + b };
  const big = Math.max(a, b), small = Math.min(a, b);
  return { question: `${big} - ${small}`, answer: big - small };
}

function generateMedium(): { question: string; answer: number } {
  const type = randomInt(0, 2);
  if (type === 0) {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    return { question: `${a} × ${b}`, answer: a * b };
  } else if (type === 1) {
    const b = randomInt(2, 12);
    const answer = randomInt(2, 12);
    const a = b * answer;
    return { question: `${a} ÷ ${b}`, answer };
  } else {
    const a = randomInt(10, 50);
    const b = randomInt(10, 50);
    return { question: `${a} + ${b}`, answer: a + b };
  }
}

function generateHard(): { question: string; answer: number } {
  const type = randomInt(0, 3);
  if (type === 0) {
    const a = randomInt(12, 25);
    const b = randomInt(12, 25);
    return { question: `${a} × ${b}`, answer: a * b };
  } else if (type === 1) {
    const a = randomInt(2, 10);
    return { question: `${a}²`, answer: a * a };
  } else if (type === 2) {
    const a = randomInt(50, 200);
    const b = randomInt(50, 200);
    return { question: `${a} + ${b}`, answer: a + b };
  } else {
    const a = randomInt(10, 20);
    const b = randomInt(2, 10);
    const c = randomInt(1, 10);
    return { question: `${a} × ${b} + ${c}`, answer: a * b + c };
  }
}

export function generateQuestion(difficulty: Difficulty, usedIds: Set<string>): MathQuestion {
  let attempts = 0;
  while (attempts < 100) {
    const gen = difficulty === 'easy' ? generateEasy()
      : difficulty === 'medium' ? generateMedium()
      : generateHard();

    const id = `${difficulty}_${gen.question}`;
    if (!usedIds.has(id)) {
      const wrongs = generateWrongAnswers(gen.answer, 3);
      const options = shuffle([gen.answer, ...wrongs]);
      return { id, question: gen.question, answer: gen.answer, options, difficulty };
    }
    attempts++;
  }
  // Fallback: generate unique
  const gen = difficulty === 'easy' ? generateEasy()
    : difficulty === 'medium' ? generateMedium()
    : generateHard();
  const id = generateId();
  const wrongs = generateWrongAnswers(gen.answer, 3);
  const options = shuffle([gen.answer, ...wrongs]);
  return { id, question: gen.question, answer: gen.answer, options, difficulty };
}
