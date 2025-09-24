import { Header } from "@/components/layout/Header";
import { Footer } from '@/components/layout/Footer';
import { GameCard } from "@/components/GameCard";
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Puzzle, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
const gameTypes = [
{
  title: 'Mini Quizzes',
  description: 'Test your knowledge with fun, quick-fire trivia questions on various topics.',
  icon: <Brain />,
  link: '/games/quiz',
  color: 'rgb(59, 130, 246)'
},
{
  title: 'Word Search',
  description: 'Find hidden words in a grid of letters. A classic puzzle to sharpen your focus.',
  icon: <Search />,
  link: '/games/wordsearch',
  color: 'rgb(34, 197, 94)'
},
{
  title: 'Crossword',
  description: 'Solve clues to fill in the intersecting words. A true test of vocabulary.',
  icon: <Puzzle />,
  link: '/games/crossword',
  color: 'rgb(250, 204, 21)'
},
{
  title: 'Anagrams',
  description: 'Unscramble letters to form words against the clock. How many can you find?',
  icon: <BookOpen />,
  link: '/games/anagrams',
  color: 'rgb(239, 68, 68)'
}];
export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {}
        <section className="py-24 md:py-32 text-center">
          <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6 animate-fade-in">
              Welcome to <span className="text-brand-blue">LexiLeap</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in animation-delay-200">
              Your playful universe of word games! Sharpen your mind, expand your vocabulary, and have fun with our collection of exciting challenges.
            </p>
            <div className="animate-fade-in animation-delay-400">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-brand-blue hover:bg-brand-blue/90 hover:scale-105 active:scale-95 transition-all as-child">
                <Link to="#games">Explore Games</Link>
              </Button>
            </div>
          </div>
        </section>
        {}
        <section id="games" className="py-16 md:py-24 bg-muted/50 scroll-mt-20">
          <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-display font-bold text-center mb-12">Choose Your Challenge</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {gameTypes.map((game, index) =>
              <div key={game.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <GameCard {...game} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Toaster richColors />
    </div>);
}