import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { GridWord } from '../../../common/crossword/grid-word';
export class CrosswordGame {
    public grid: GridWord[] = [];
    public definitions: string;
    private gameMode: string;

    public player1Id: string = null;
    public player2Id: string = null;
    constructor(configs: CrosswordGameConfigs) {
        this.gameMode = configs.gameMode;
        // other attributes
    }

    public getGameInfo(): Object {
        return {
            'player 1 id': this.player1Id,
            'player 2 id': this.player2Id
        };
    }
}
