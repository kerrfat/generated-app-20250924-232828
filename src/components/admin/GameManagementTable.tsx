import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { Game } from '@shared/types';
import { toast } from 'sonner';
import { GameEditorModal } from './GameEditorModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
export function GameManagementTable() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await api<Game[]>('/api/games');
      setGames(data);
    } catch (error) {
      toast.error('Failed to fetch games.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGames();
  }, []);
  const handleSaveGame = async (game: Game) => {
    const isNew = !games.some(g => g.id === game.id);
    const endpoint = isNew ? '/api/admin/games' : `/api/admin/games/${game.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      await api(endpoint, {
        method,
        body: JSON.stringify(game),
        headers: { 'X-Admin-Secret': sessionStorage.getItem('admin-secret') || '' }
      });
      toast.success(`Game ${isNew ? 'created' : 'updated'} successfully!`);
      fetchGames(); // Refresh list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Failed to save game: ${errorMessage}`);
      throw error; // re-throw to keep modal open
    }
  };
  const handleDeleteGame = async (gameId: string) => {
    try {
      await api(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Secret': sessionStorage.getItem('admin-secret') || '' }
      });
      toast.success('Game deleted successfully!');
      setGames(games.filter(g => g.id !== gameId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Failed to delete game: ${errorMessage}`);
    }
  };
  const handleAddNew = () => {
    setEditingGame(null);
    setIsModalOpen(true);
  };
  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Games</h2>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Game
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading games...</TableCell></TableRow>
            ) : games.length > 0 ? (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell><Badge variant="outline">{game.type}</Badge></TableCell>
                  <TableCell>{game.category}</TableCell>
                  <TableCell>{game.difficulty}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(game)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the game "{game.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteGame(game.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center">No games found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <GameEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        game={editingGame}
        onSave={handleSaveGame}
      />
    </>
  );
}