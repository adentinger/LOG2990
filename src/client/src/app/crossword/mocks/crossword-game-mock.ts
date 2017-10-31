import { CrosswordGame } from '../class/crossword-game';
import { GameMode } from '../../../../../common/src/crossword/crossword-enums';

export function mockCrosswordGame(): CrosswordGame {
    return {
        player1: 'Robert',
        player2: 'Gille',
        gameMode: GameMode.Classic,
        difficulty: 'EXTREME'
    };
}
