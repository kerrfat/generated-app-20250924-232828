import type { Game } from '@shared/types';
export const MOCK_GAMES_SEED: readonly Game[] = [
  // Quiz Games
  {
    id: 'quiz-1',
    type: 'Quiz',
    title: 'Animal Trivia',
    difficulty: 'Easy',
    category: 'Animals',
    data: [
      { question: 'What is the largest land animal?', options: ['Elephant', 'Rhino', 'Hippo', 'Giraffe'], correctAnswer: 'Elephant' },
      { question: 'Which bird is known for its beautiful tail feathers?', options: ['Peacock', 'Eagle', 'Parrot', 'Swan'], correctAnswer: 'Peacock' },
      { question: 'What is a group of lions called?', options: ['Pack', 'Herd', 'Pride', 'Flock'], correctAnswer: 'Pride' },
    ],
  },
  {
    id: 'quiz-2',
    type: 'Quiz',
    title: 'Space Exploration',
    difficulty: 'Medium',
    category: 'Space',
    data: [
      { question: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Saturn'], correctAnswer: 'Mars' },
      { question: 'Who was the first human to walk on the moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], correctAnswer: 'Neil Armstrong' },
      { question: 'What is the name of the galaxy we live in?', options: ['Andromeda', 'Triangulum', 'Whirlpool', 'Milky Way'], correctAnswer: 'Milky Way' },
    ],
  },
  // Word Search
  {
    id: 'wordsearch-1',
    type: 'WordSearch',
    title: 'Fruity Fun',
    difficulty: 'Easy',
    category: 'General Knowledge',
    data: {
      grid: [
        ['A', 'P', 'P', 'L', 'E', 'S'],
        ['B', 'A', 'N', 'A', 'N', 'A'],
        ['O', 'R', 'A', 'N', 'G', 'E'],
        ['G', 'R', 'A', 'P', 'E', 'S'],
        ['P', 'E', 'A', 'R', 'S', 'T'],
        ['C', 'H', 'E', 'R', 'R', 'Y'],
      ],
      words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPES', 'PEAR', 'CHERRY'],
      wordPositions: {
        APPLE: { start: { row: 0, col: 0 }, end: { row: 0, col: 4 } },
        BANANA: { start: { row: 1, col: 0 }, end: { row: 1, col: 5 } },
        ORANGE: { start: { row: 2, col: 0 }, end: { row: 2, col: 5 } },
        GRAPES: { start: { row: 3, col: 0 }, end: { row: 3, col: 5 } },
        PEAR: { start: { row: 4, col: 0 }, end: { row: 4, col: 3 } },
        CHERRY: { start: { row: 5, col: 0 }, end: { row: 5, col: 5 } },
      },
    },
  },
  // Crossword
  {
    id: 'crossword-1',
    type: 'Crossword',
    title: 'Beginner Crossword',
    difficulty: 'Easy',
    category: 'Vocabulary',
    data: {
      size: { rows: 5, cols: 5 },
      clues: [
        { number: 1, direction: 'across', clue: 'Opposite of hot', answer: 'COLD', row: 0, col: 1 },
        { number: 2, direction: 'across', clue: 'A small insect', answer: 'ANT', row: 2, col: 0 },
        { number: 3, direction: 'across', clue: 'Not old', answer: 'NEW', row: 4, col: 2 },
        { number: 1, direction: 'down', clue: 'A feline pet', answer: 'CAT', row: 0, col: 1 },
        { number: 4, direction: 'down', clue: 'A vehicle', answer: 'CAR', row: 2, col: 4 },
      ],
    },
  },
  // Anagrams
  {
    id: 'anagrams-1',
    type: 'Anagrams',
    title: 'Simple Scramble',
    difficulty: 'Easy',
    category: 'Vocabulary',
    data: {
      words: ['LISTEN', 'TRIANGLE', 'EARTH'],
    },
  },
];