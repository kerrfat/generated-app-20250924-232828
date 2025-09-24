import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CrosswordGameData } from '@shared/types';
interface CrosswordGameProps {
  gameData: CrosswordGameData;
  onGameComplete: (score: number, time: number) => void;
}
type Direction = 'across' | 'down';
export function CrosswordGame({ gameData, onGameComplete }: CrosswordGameProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [activeClue, setActiveClue] = useState<{ index: number; direction: Direction } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  useEffect(() => {
    const { size, clues } = gameData.data;
    const newGrid = Array(size.rows).fill(null).map(() => Array(size.cols).fill(''));
    const newRefs = Array(size.rows).fill(null).map(() => Array(size.cols).fill(null));
    clues.forEach(clue => {
      let { row, col } = clue;
      for (let i = 0; i < clue.answer.length; i++) {
        if (newGrid[row] && newGrid[row][col] !== undefined) {
          newGrid[row][col] = ' '; // Mark as an active cell
        }
        if (clue.direction === 'across') col++;
        else row++;
      }
    });
    setGrid(newGrid.map(row => row.map(cell => cell === ' ' ? '' : 'BLACK')));
    inputRefs.current = newRefs;
  }, [gameData]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = e.target.value.toUpperCase().slice(-1);
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
    if (value && activeClue) {
      const { direction } = activeClue;
      let nextRow = row;
      let nextCol = col;
      if (direction === 'across') nextCol++;
      else nextRow++;
      if (
        nextRow < gameData.data.size.rows &&
        nextCol < gameData.data.size.cols &&
        grid[nextRow]?.[nextCol] !== 'BLACK'
      ) {
        inputRefs.current[nextRow]?.[nextCol]?.focus();
      }
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'Backspace' && !grid[row][col]) {
      let prevRow = row;
      let prevCol = col;
      if (activeClue?.direction === 'across') prevCol--;
      else prevRow--;
      if (prevRow >= 0 && prevCol >= 0) {
        inputRefs.current[prevRow]?.[prevCol]?.focus();
      }
    }
  };
  const handleFocus = (row: number, col: number) => {
    if (!activeClue) return;
    const { index, direction } = activeClue;
    const clue = gameData.data.clues[index];
    if (
      (direction === 'across' && row === clue.row && col >= clue.col && col < clue.col + clue.answer.length) ||
      (direction === 'down' && col === clue.col && row >= clue.row && row < clue.row + clue.answer.length)
    ) {
      return;
    }
    const newActiveClue = findClueForCell(row, col);
    if (newActiveClue) setActiveClue(newActiveClue);
  };
  const findClueForCell = (row: number, col: number): { index: number; direction: Direction } | null => {
    const acrossClueIndex = gameData.data.clues.findIndex(c => c.direction === 'across' && c.row === row && col >= c.col && col < c.col + c.answer.length);
    if (acrossClueIndex !== -1) return { index: acrossClueIndex, direction: 'across' };
    const downClueIndex = gameData.data.clues.findIndex(c => c.direction === 'down' && c.col === col && row >= c.row && row < c.row + c.answer.length);
    if (downClueIndex !== -1) return { index: downClueIndex, direction: 'down' };
    return null;
  };
  const checkSolution = () => {
    let correctCount = 0;
    gameData.data.clues.forEach(clue => {
      let { row, col } = clue;
      let word = '';
      for (let i = 0; i < clue.answer.length; i++) {
        word += grid[row][col];
        if (clue.direction === 'across') col++;
        else row++;
      }
      if (word === clue.answer.toUpperCase()) {
        correctCount++;
      }
    });
    if (correctCount === gameData.data.clues.length) {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      onGameComplete(correctCount, timeTaken);
    } else {
      toast.error(`You have ${correctCount} out of ${gameData.data.clues.length} words correct. Keep trying!`);
    }
  };
  const cellSize = "w-8 h-8 md:w-10 md:h-10";
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
      <Card className="rounded-2xl shadow-lg flex-1">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{gameData.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${gameData.data.size.cols}, minmax(0, 1fr))` }}>
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const clueNumber = gameData.data.clues.find(c => c.row === rIdx && c.col === cIdx)?.number;
                const isActive = activeClue &&
                  ((activeClue.direction === 'across' && gameData.data.clues[activeClue.index].row === rIdx && cIdx >= gameData.data.clues[activeClue.index].col && cIdx < gameData.data.clues[activeClue.index].col + gameData.data.clues[activeClue.index].answer.length) ||
                  (activeClue.direction === 'down' && gameData.data.clues[activeClue.index].col === cIdx && rIdx >= gameData.data.clues[activeClue.index].row && rIdx < gameData.data.clues[activeClue.index].row + gameData.data.clues[activeClue.index].answer.length));
                return cell === 'BLACK' ? (
                  <div key={`${rIdx}-${cIdx}`} className={cn(cellSize, "bg-gray-800 border border-gray-900")} />
                ) : (
                  <div key={`${rIdx}-${cIdx}`} className={cn(cellSize, "relative border border-gray-400", isActive ? "bg-brand-yellow/30" : "bg-white")}>
                    {clueNumber && <span className="absolute top-0 left-0.5 text-xs font-bold">{clueNumber}</span>}
                    <input
                      ref={el => {
                        if (inputRefs.current[rIdx]) {
                          inputRefs.current[rIdx][cIdx] = el;
                        }
                      }}
                      type="text"
                      maxLength={1}
                      value={grid[rIdx][cIdx]}
                      onChange={(e) => handleInputChange(e, rIdx, cIdx)}
                      onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                      onFocus={() => handleFocus(rIdx, cIdx)}
                      className="w-full h-full text-center text-lg md:text-xl font-bold uppercase bg-transparent focus:outline-none"
                    />
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      <div className="w-full lg:w-80">
        <Card className="rounded-2xl shadow-lg mb-4">
          <CardHeader><CardTitle className="font-display text-xl">Across</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {gameData.data.clues.filter(c => c.direction === 'across').map((clue, index) => (
              <p key={index} onClick={() => setActiveClue({ index: gameData.data.clues.indexOf(clue), direction: 'across' })} className={cn("cursor-pointer p-1 rounded", activeClue?.index === gameData.data.clues.indexOf(clue) && "bg-brand-blue/20")}>
                <strong>{clue.number}.</strong> {clue.clue}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader><CardTitle className="font-display text-xl">Down</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {gameData.data.clues.filter(c => c.direction === 'down').map((clue, index) => (
              <p key={index} onClick={() => setActiveClue({ index: gameData.data.clues.indexOf(clue), direction: 'down' })} className={cn("cursor-pointer p-1 rounded", activeClue?.index === gameData.data.clues.indexOf(clue) && "bg-brand-blue/20")}>
                <strong>{clue.number}.</strong> {clue.clue}
              </p>
            ))}
          </CardContent>
        </Card>
        <Button onClick={checkSolution} className="w-full mt-4 rounded-xl bg-brand-green hover:bg-brand-green/90">Check Puzzle</Button>
      </div>
    </div>
  );
}