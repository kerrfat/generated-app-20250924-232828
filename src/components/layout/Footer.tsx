import React, { useState } from 'react';
import { BrainCircuit, Twitter, Github, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await api('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast.success("You've been subscribed to our newsletter!");
      setEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Subscription failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-background border-t">
      <div className="container max-w-6xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-brand-blue" />
              <span className="font-display text-2xl font-bold">LexiLeap</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              A vibrant and educational web app featuring a collection of fun word games designed with a playful, kid-friendly aesthetic.
            </p>
            <p className="text-sm text-muted-foreground">Built with ❤️ at Cloudflare</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
              <li><a href="#games" className="text-muted-foreground hover:text-foreground">Games</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Stay up to date with our latest games and news.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} LexiLeap. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground"><Twitter /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground"><Github /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground"><Mail /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}