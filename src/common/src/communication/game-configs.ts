import { Difficulty, GameMode, CreateOrJoin } from '../crossword/crossword-enums';

export type PlayerNumber = number;
export type GameId = number;

export interface CrosswordGameConfigs {
    gameMode: GameMode;
    playerNumber: PlayerNumber;
    createJoin: CreateOrJoin;
    difficulty: Difficulty;
    gameId: GameId;
}
