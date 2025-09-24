import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Game } from '@shared/types';
interface GameEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Partial<Game> | null;
  onSave: (game: Game) => Promise<void>;
}
export function GameEditorModal({ isOpen, onClose, game, onSave }: GameEditorModalProps) {
  const [jsonText, setJsonText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (game) {
      setJsonText(JSON.stringify(game, null, 2));
    } else {
      setJsonText(JSON.stringify({
        id: `game-${Date.now()}`,
        type: 'Quiz',
        title: 'New Game',
        difficulty: 'Easy',
        category: 'General Knowledge',
        data: []
      }, null, 2));
    }
  }, [game]);
  const handleSave = async () => {
    let parsedGame: Game;
    try {
      parsedGame = JSON.parse(jsonText);
      // Basic validation
      if (!parsedGame.id || !parsedGame.type || !parsedGame.title) {
        throw new Error('Missing required fields: id, type, title.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format.';
      toast.error(`Validation Failed: ${errorMessage}`);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(parsedGame);
      onClose();
    } catch (error) {
      // Error toast is handled by the parent component's onSave implementation
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{game ? 'Edit Game' : 'Add New Game'}</DialogTitle>
          <DialogDescription>
            Modify the JSON definition for the game below. Ensure the structure is correct before saving.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="json-editor">Game JSON</Label>
            <Textarea
              id="json-editor"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="h-80 font-mono text-sm"
              placeholder="Enter game JSON here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Game'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}