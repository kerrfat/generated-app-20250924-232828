import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Game } from '@shared/types';
import { QuizGame } from './games/QuizGame';
import { WordSearchGame } from './games/WordSearchGame';
import { CrosswordGame } from './games/CrosswordGame';
import { AnagramsGame } from './games/AnagramsGame';
import { SuccessModal } from "@/components/SuccessModal";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
export function GameWrapper() {
  const { gameId } = useParams<{gameId: string;}>();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  useEffect(() => {
    if (!gameId) {
      setError("No game ID provided.");
      setLoading(false);
      return;
    }
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api<Game>(`/api/games/${gameId}`);
        setGameData(data);
      } catch (err) {
        setError("Failed to load the game. Please try again later.");
        toast.error("Failed to load the game.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);
  const handleGameComplete = async (score: number, time: number) => {
    setFinalScore(score);
    setFinalTime(time);
    setIsSuccessModalOpen(true);
    try {
      if (gameId) {
        await api('/api/play', {
          method: 'POST',
          body: JSON.stringify({ gameId, score, time })
        });
      }
    } catch (err) {
      console.error("Failed to save analytics:", err);
      toast.error("Could not save your game results.");
    }
  };
  const handlePlayAgain = () => {
    setIsSuccessModalOpen(false);
    if (gameData) {
      navigate(`/games/${gameData.type.toLowerCase()}`);
    } else {
      navigate('/');
    }
  };
  const handleGoToDashboard = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };
  if (loading) {
    return <Skeleton className="w-full h-96 rounded-2xl" />;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
  }
  if (!gameData) {
    return <div className="text-center py-10">Game not found!</div>;
  }
  const renderGame = (game: Game) => {
    switch (game.type) {
      case 'Quiz':
        return <QuizGame gameData={game} onGameComplete={handleGameComplete} />;
      case 'WordSearch':
        return <WordSearchGame gameData={game} onGameComplete={handleGameComplete} />;
      case 'Crossword':
        return <CrosswordGame gameData={game} onGameComplete={handleGameComplete} />;
      case 'Anagrams':
        return <AnagramsGame gameData={game} onGameComplete={handleGameComplete} />;
      default:
        return <div>Unsupported game type</div>;
    }
  };
  return (
    <>
      {renderGame(gameData)}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        score={finalScore}
        time={finalTime}
        onPlayAgain={handlePlayAgain}
        onGoToDashboard={handleGoToDashboard} />
    </>);
}