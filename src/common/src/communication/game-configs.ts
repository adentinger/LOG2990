import { Difficulty, GameMode } from '../crossword/crossword-enums';

export interface CrosswordGameConfigs {
    gameMode: GameMode;
    playerNumber: string;
    createJoin: string;
    difficulty: Difficulty;
}
