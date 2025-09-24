import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { WordSearchGameData } from '@shared/types';
interface WordSearchGameProps {
  gameData: WordSearchGameData;
  onGameComplete: (score: number, time: number) => void;
}
type Cell = { row: number; col: number };
export function WordSearchGame({ gameData, onGameComplete }: WordSearchGameProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<Cell[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const { grid, words } = gameData.data;
  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelection([{ row, col }]);
  };
  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selection[0]) return;
    const start = selection[0];
    const path: Cell[] = [];
    const dx = Math.sign(col - start.col);
    const dy = Math.sign(row - start.row);
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (
      start.row === row || // Horizontal
      start.col === col || // Vertical
      Math.abs(row - start.row) === Math.abs(col - start.col) // Diagonal
    ) {
      let r, c;
      for (r = start.row, c = start.col; r !== row + dy || c !== col + dx; r += dy, c += dx) {
        path.push({ row: r, col: c });
        if (r === row && c === col) break;
      }
      setSelection(path);
    }
  };
  const handleMouseUp = useCallback(() => {
    if (!isSelecting || selection.length === 0) return;
    let selectedWord = '';
    selection.forEach(({ row, col }) => {
      selectedWord += grid[row][col];
    });
    const reversedSelectedWord = selectedWord.split('').reverse().join('');
    const wordToFind = words.find(
      w => !foundWords.includes(w) && (w.toUpperCase() === selectedWord || w.toUpperCase() === reversedSelectedWord)
    );
    if (wordToFind) {
      const newFoundWords = [...foundWords, wordToFind];
      setFoundWords(newFoundWords);
      toast.success(`You found "${wordToFind}"!`, { duration: 1500 });
      if (newFoundWords.length === words.length) {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        onGameComplete(words.length, timeTaken);
      }
    }
    setIsSelecting(false);
    setSelection([]);
  }, [isSelecting, selection, grid, words, foundWords, onGameComplete, startTime]);
  useEffect(() => {
    setStartTime(Date.now());
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);
  const isCellSelected = (row: number, col: number) => {
    return selection.some(cell => cell.row === row && cell.col === col);
  };
  const isCellFound = (row: number, col: number) => {
    for (const word of foundWords) {
      const info = gameData.data.wordPositions[word.toUpperCase()];
      if (!info) continue;
      const { start, end } = info;
      const dx = Math.sign(end.col - start.col);
      const dy = Math.sign(end.row - start.row);
      let r, c;
      for (r = start.row, c = start.col; r !== end.row + dy || c !== end.col + dx; r += dy, c += dx) {
        if (r === row && c === col) return true;
        if (r === end.row && c === end.col) break;
      }
    }
    return false;
  };
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      <Card className="rounded-2xl shadow-lg flex-1">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{gameData.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-2 sm:p-4">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
            {grid.map((row, rIdx) =>
              row.map((letter, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                  onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                  className={cn(
                    "flex items-center justify-center aspect-square text-sm sm:text-lg md:text-xl font-bold select-none cursor-pointer rounded-md transition-colors duration-200",
                    isCellSelected(rIdx, cIdx) && "bg-brand-yellow text-black scale-105",
                    isCellFound(rIdx, cIdx) && "bg-brand-green text-white",
                    !isCellSelected(rIdx, cIdx) && !isCellFound(rIdx, cIdx) && "bg-muted hover:bg-muted/80"
                  )}
                >
                  {letter}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <div className="w-full md:w-64">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-display text-xl">Words to Find</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {words.map(word => (
                <li
                  key={word}
                  className={cn(
                    "text-lg transition-all duration-300",
                    foundWords.includes(word) ? "line-through text-muted-foreground" : "font-semibold"
                  )}
                >
                  {word}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}