import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { GridWord } from '../../../common/crossword/grid-word';
export class CrosswordGame {
    public grid: GridWord[] = [];
    public definitions: string;
    private gameMode: string;
    constructor(configs: CrosswordGameConfigs) {
        this.gameMode = configs.gameMode;
        // other attributes
    }

    public getStatus(): String {    // MOCK
        return 'game of type ' + this.gameMode + 'in process';
    }
}
