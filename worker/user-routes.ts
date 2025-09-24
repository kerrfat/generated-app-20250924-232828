import { Hono } from "hono";
import type { Env } from './core-utils';
import { GameEntity, UserEntity, PlayEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, Play, Game } from "@shared/types";
// Simple secret key authentication middleware
const authMiddleware = async (c: any, next: any) => {
  const secret = c.req.header('X-Admin-Secret');
  // In a real app, use a more secure method like environment variables and constant-time comparison
  if (secret === 'lexileap-secret-key') {
    await next();
  } else {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await GameEntity.ensureSeed(c.env);
    await next();
  });
  // PUBLIC ROUTES
  app.get('/api/games', async (c) => {
    const { items } = await GameEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/games/:id', async (c) => {
    const { id } = c.req.param();
    const game = new GameEntity(c.env, id);
    if (!(await game.exists())) {
      return notFound(c, 'Game not found');
    }
    return ok(c, await game.getState());
  });
  app.post('/api/register', async (c) => {
    const { email, name } = (await c.req.json()) as { email?: string; name?: string };
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return bad(c, 'A valid email is required.');
    }
    const user: User = {
      id: email.toLowerCase(),
      name: name?.trim(),
      createdAt: Date.now(),
    };
    await UserEntity.create(c.env, user);
    return ok(c, { message: 'Successfully subscribed!' });
  });
  app.post('/api/play', async (c) => {
    const { gameId, score, time } = (await c.req.json()) as { gameId?: string; score?: number; time?: number };
    if (!isStr(gameId) || typeof score !== 'number' || typeof time !== 'number') {
      return bad(c, 'Missing required fields: gameId, score, time.');
    }
    const play: Play = {
      id: crypto.randomUUID(),
      gameId,
      score,
      time,
      playedAt: Date.now(),
    };
    await PlayEntity.create(c.env, play);
    return ok(c, { message: 'Play session recorded.' });
  });
  // ADMIN ROUTES (SECURED)
  const admin = new Hono<{ Bindings: Env }>();
  admin.use('*', authMiddleware);
  admin.get('/analytics', async (c) => {
    const { items } = await PlayEntity.list(c.env);
    return ok(c, items);
  });
  admin.get('/subscribers', async (c) => {
    const { items } = await UserEntity.list(c.env);
    return ok(c, items);
  });
  admin.post('/games', async (c) => {
    const gameData = await c.req.json<Game>();
    if (!gameData.id || !gameData.title || !gameData.type) {
        return bad(c, 'Invalid game data. Missing id, title, or type.');
    }
    await GameEntity.create(c.env, gameData);
    return ok(c, gameData);
  });
  admin.put('/games/:id', async (c) => {
    const { id } = c.req.param();
    const gameData = await c.req.json<Game>();
    const game = new GameEntity(c.env, id);
    if (!(await game.exists())) {
        return notFound(c, 'Game not found');
    }
    await game.save(gameData);
    return ok(c, gameData);
  });
  admin.delete('/games/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await GameEntity.delete(c.env, id);
    if (!deleted) {
        return notFound(c, 'Game not found');
    }
    return ok(c, { message: 'Game deleted successfully' });
  });
  app.route('/api/admin', admin);
}