import { CrosswordGameConfigs, GameId } from '../../../../../../common/src/communication/game-configs';
import { GameMode, Difficulty } from '../../../../../../common/src/crossword/crossword-enums';

export class UserDisplayableGameData {

    private idInternal: string;
    private modeInternal: string;
    private difficultyInternal: string;

    constructor(gameId: GameId, gameMode: GameMode, difficulty: Difficulty) {

    }

}
