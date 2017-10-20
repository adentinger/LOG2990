import { Difficulty } from '../crossword/crossword-enums';

export interface CrosswordGameConfigs {
    gameMode: string;
    playerNumber: string;
    createJoin: string;
    difficulty: Difficulty;
}
