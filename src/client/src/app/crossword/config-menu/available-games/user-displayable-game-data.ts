import { CrosswordGameConfigs, GameId } from '../../../../../../common/src/communication/game-configs';
import { GameMode, Difficulty } from '../../../../../../common/src/crossword/crossword-enums';

/**
 * @class UserDisplayableGameData
 * @description Contains the data of a game as text so that it can be
 * displayed to the user.
 */
export class UserDisplayableGameData {

    private idInternal: string;
    private modeInternal: string;
    private difficultyInternal: string;

    constructor(gameId: GameId, gameMode: GameMode, difficulty: Difficulty) {

    }

    public get id(): string {
        return this.idInternal;
    }

    public get mode(): string {
        return this.modeInternal;
    }

    public get difficulty(): string {
        return this.difficultyInternal;
    }

}
