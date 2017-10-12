import { CrosswordGameConfigs } from '../../../../../common/communication/game-configs';
export class CrosswordGame {

    private gameMode: string;
    constructor(configs: CrosswordGameConfigs) {
        this.gameMode = configs.gameMode;
        // other attributes
    }

    public getStatus(): String {    // MOCK
        return 'game of type ' + this.gameMode + 'in process';
    }
}
