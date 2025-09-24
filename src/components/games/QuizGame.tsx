import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { QuizGameData } from '@shared/types';
import { CheckCircle, XCircle } from 'lucide-react';
interface QuizGameProps {
  gameData: QuizGameData;
  onGameComplete: (score: number, time: number) => void;
}
export function QuizGame({ gameData, onGameComplete }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const currentQuestion = gameData.data[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / gameData.data.length) * 100;
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < gameData.data.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000);
        onGameComplete(score + (isCorrect ? 1 : 0), timeTaken);
      }
    }, 1500);
  };
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-muted';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-200 border-green-500 text-green-800';
    }
    if (option === selectedAnswer) {
      return 'bg-red-200 border-red-500 text-red-800';
    }
    return 'bg-white opacity-60';
  };
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="font-display text-2xl">{gameData.title}</CardTitle>
            <div className="font-bold text-lg text-brand-blue">{score} / {gameData.data.length}</div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-center my-8 min-h-[6rem]">
                {currentQuestion.question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={cn(
                      "h-auto py-4 text-lg rounded-xl border-2 transition-all duration-300 flex justify-between items-center",
                      getButtonClass(option)
                    )}
                  >
                    <span>{option}</span>
                    {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle className="h-6 w-6 text-green-600" />}
                    {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XCircle className="h-6 w-6 text-red-600" />}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}