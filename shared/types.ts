// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Newsletter User
export interface User {
  id: string; // email address
  name?: string;
  createdAt: number;
}
// Play Analytics
export interface Play {
  id: string; // random uuid
  gameId: string;
  score: number;
  time: number; // in seconds
  playedAt: number;
}
// Game Data Structures
export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';
export type GameCategory = 'General Knowledge' | 'Animals' | 'Space' | 'Vocabulary';
interface BaseGame {
  id: string;
  type: string;
  title: string;
  difficulty: GameDifficulty;
  category: GameCategory;
}
// Quiz Game
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
export interface QuizGameData extends BaseGame {
  type: 'Quiz';
  data: QuizQuestion[];
}
// Word Search Game
export interface WordSearchData {
  grid: string[][];
  words: string[];
  wordPositions: {
    [word: string]: {
      start: { row: number; col: number };
      end: { row: number; col: number };
    };
  };
}
export interface WordSearchGameData extends BaseGame {
  type: 'WordSearch';
  data: WordSearchData;
}
// Crossword Game
export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}
export interface CrosswordData {
  size: { rows: number; cols: number };
  clues: CrosswordClue[];
}
export interface CrosswordGameData extends BaseGame {
  type: 'Crossword';
  data: CrosswordData;
}
// Anagrams Game
export interface AnagramData {
  words: string[];
}
export interface AnagramGameData extends BaseGame {
  type: 'Anagrams';
  data: AnagramData;
}
export type Game = QuizGameData | WordSearchGameData | CrosswordGameData | AnagramGameData;