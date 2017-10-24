import { GameMode } from "../../../../../common/src/crossword/crossword-enums";

export interface CrosswordGame {
    player1: string;
    player2: string;
    gameMode: GameMode;
    difficulty: string;
}
