import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { GridWord } from '../../../common/crossword/grid-word';
import { DEFINITIONS_MOCK } from '../mocks/definitions-mock';
import { Definition } from '../../../common/crossword/definition';

export class CrosswordGame {
    public horizontalGrid: GridWord[] = [];
    public verticalGrid: GridWord[] = [];

    public horizontalDefinitions: Definition[] = [];
    public verticalDefinitions: Definition[] = [];
    // public definitions: string;
    private gameMode: string;

    public player1Id: string = null;
    public player2Id: string = null;
    constructor(configs: CrosswordGameConfigs) {
        this.gameMode = configs.gameMode;
        // other attributes

        this.horizontalDefinitions = DEFINITIONS_MOCK;
        this.verticalDefinitions = DEFINITIONS_MOCK;
        // console.log('new state of the game: ' + JSON.stringify(this.getGameInfo()));
    }

    public getGameInfo(): Object {
        return {
            'player1Id': this.player1Id,
            'player2Id': this.player2Id,
            'numberOfGridWords': this.getNumberOfWordsInGrid(),
            'numberOfDefinitions': this.getNumberOfDefinitions(),
        };
    }

    private getNumberOfDefinitions(): number {
        return this.horizontalDefinitions.length
            + this.verticalDefinitions.length;
    }

    private getNumberOfWordsInGrid(): number {
        return this.horizontalGrid.length
            + this.verticalGrid.length;
    }
}
