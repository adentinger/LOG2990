import { Difficulty, GameMode, CreateOrJoin } from '../crossword/crossword-enums';

export type PlayerNumber = 1 | 2;

export interface CrosswordGameConfigs {
    gameMode: GameMode;
    playerNumber: PlayerNumber;
    createJoin: CreateOrJoin;
    difficulty: Difficulty;
}
