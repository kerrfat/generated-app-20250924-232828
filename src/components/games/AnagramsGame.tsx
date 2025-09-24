import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { AnagramGameData } from '@shared/types';
interface AnagramsGameProps {
  gameData: AnagramGameData;
  onGameComplete: (score: number, time: number) => void;
}
export function AnagramsGame({ gameData, onGameComplete }: AnagramsGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const currentAnagram = gameData.data.words[currentWordIndex];
  const progress = ((currentWordIndex) / gameData.data.words.length) * 100;
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  const scrambledWord = useMemo(() => {
    // Ensure the same scramble is shown for a given word within a session
    return currentAnagram.split('').sort(() => Math.random() - 0.5).join('');
  }, [currentAnagram]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (inputValue.trim().toLowerCase() === currentAnagram.toLowerCase()) {
      toast.success("Correct!", { duration: 1500 });
      const newScore = score + 1;
      setScore(newScore);
      if (currentWordIndex < gameData.data.words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setInputValue('');
      } else {
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000);
        onGameComplete(newScore, timeTaken);
      }
    } else {
      toast.error("Not quite, try again!", { duration: 1500 });
    }
  };
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="font-display text-2xl">{gameData.title}</CardTitle>
            <div className="font-bold text-lg text-brand-blue">{score} / {gameData.data.words.length}</div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-muted-foreground mb-4">Unscramble the letters to form a word:</p>
              <div className="flex justify-center items-center space-x-2 my-8">
                {scrambledWord.split('').map((letter, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-brand-yellow text-gray-900 rounded-lg w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-bold text-2xl md:text-3xl shadow-md"
                  >
                    {letter.toUpperCase()}
                  </motion.div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2 mt-8">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Your guess..."
                  className="text-center text-lg h-12 rounded-xl"
                  autoFocus
                />
                <Button type="submit" className="h-12 rounded-xl bg-brand-blue hover:bg-brand-blue/90">Guess</Button>
              </form>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}