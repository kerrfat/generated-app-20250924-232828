import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Game } from '@shared/types';
import { motion } from 'framer-motion';
import { ArrowRight, Tag, BarChart } from 'lucide-react';
export function GameSelectionPage() {
  const { gameType } = useParams<{gameType: string;}>();
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const games = await api<Game[]>('/api/games');
        setAllGames(games);
      } catch (err) {
        setError("Failed to load games. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);
  const gamesForType = useMemo(() =>
  allGames.filter((game) => game.type.toLowerCase() === gameType?.toLowerCase()),
  [allGames, gameType]
  );
  const categories = useMemo(() =>
  ['All', ...Array.from(new Set(gamesForType.map((g) => g.category)))],
  [gamesForType]
  );
  const difficulties = useMemo(() =>
  ['All', ...Array.from(new Set(gamesForType.map((g) => g.difficulty)))],
  [gamesForType]
  );
  const filteredGames = useMemo(() => {
    return gamesForType.filter((game) =>
    (categoryFilter === 'All' || game.category === categoryFilter) && (
    difficultyFilter === 'All' || game.difficulty === difficultyFilter)
    );
  }, [gamesForType, categoryFilter, difficultyFilter]);
  const pageTitle = gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) + ' Puzzles' : 'Select a Game';
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>);
    }
    if (error) {
      return <div className="text-center py-16 text-red-500 font-semibold">{error}</div>;
    }
    if (filteredGames.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, index) =>
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}>
              <Card className="h-full flex flex-col rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                <CardHeader>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>A fun {game.type} challenge.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span>{game.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart className="w-4 h-4" />
                    <span>{game.difficulty}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full rounded-xl bg-brand-blue hover:bg-brand-blue/90">
                    <Link to={`/game/${game.id}`}>
                      Play Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>);
    }
    return (
      <div className="text-center py-16 bg-muted/50 rounded-2xl">
        <h3 className="text-2xl font-semibold">No Puzzles Found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters to find more games.</p>
      </div>);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-6xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold tracking-tighter">{pageTitle}</h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Choose a puzzle from the collection below to start playing.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={loading}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter} disabled={loading}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => <SelectItem key={diff} value={diff}>{diff}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {renderContent()}
      </main>
      <Footer />
    </div>);
}