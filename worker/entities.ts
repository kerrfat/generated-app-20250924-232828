import { IndexedEntity } from "./core-utils";
import type { Game, User, Play } from "@shared/types";
import { MOCK_GAMES_SEED } from "./seed-data";
// GAME ENTITY
export class GameEntity extends IndexedEntity<Game> {
  static readonly entityName = "game";
  static readonly indexName = "games";
  static readonly initialState: Game = {
    id: "",
    type: "Quiz",
    title: "",
    difficulty: "Easy",
    category: "General Knowledge",
    data: [],
  };
  static seedData = MOCK_GAMES_SEED;
}
// USER ENTITY (for Newsletter)
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", createdAt: 0 };

}
// PLAY ENTITY (for Analytics)
export class PlayEntity extends IndexedEntity<Play> {
  static readonly entityName = "play";
  static readonly indexName = "plays";
  static readonly initialState: Play = {
    id: "",
    gameId: "",
    score: 0,
    time: 0,
    playedAt: 0,
  };
}