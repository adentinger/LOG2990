import { Difficulty } from '../../common/crossword/crossword-enums';

export interface CrosswordGameConfigs {
    gameMode: string;
    playerNumber: string;
    createJoin: string;
    difficulty: Difficulty;
}
