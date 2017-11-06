import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { PlayerNumber, GameId, CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';

export enum CreateOrJoin {
    create,
    join
}

export class MenuAutomatonChoices {

    public gameMode: GameMode;
    public playerNumber: PlayerNumber;
    public difficulty: Difficulty;
    public createOrJoin: CreateOrJoin;
    public chosenGame: GameId;

    constructor(gameMode?: GameMode,
                playerNumber?: PlayerNumber,
                difficulty?: Difficulty,
                createOrJoin?: CreateOrJoin,
                chosenGame?: GameId) {
        this.gameMode = gameMode;
        this.playerNumber = playerNumber;
        this.difficulty = difficulty;
        this.createOrJoin = createOrJoin;
        this.chosenGame = chosenGame;
    }

    public toGameConfiguration(): CrosswordGameConfigs {
        return {
            difficulty: this.difficulty,
            gameMode: this.gameMode,
            playerNumber: this.playerNumber
        };
    }

}
