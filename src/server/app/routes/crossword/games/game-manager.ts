import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { CrosswordGame } from './crossword-game';

const ID_LENGTH = 8;

export class GameManager {

    private static instance: GameManager; // Singleton
    private games: Map<string, CrosswordGame> = new Map();

    public static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public newGame(configs: CrosswordGameConfigs): string {
        let newId: string;
        do {
            newId = this.generateRandomString(ID_LENGTH);
        } while (this.games.has(newId));

        // TODO initialize game
        this.games[newId] = new CrosswordGame(configs);
        console.log('new game created in gameManager: ' + JSON.stringify(this.games[newId]));
        return newId;
    }

    public getGame(id: string): CrosswordGame {
        if (this.games.has(id)) {
            return this.games['id'];
        } else {
            throw new Error('This id does not exist');
        }
    }

    private generateRandomString(length: number): string {
        let text = '';
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return text;
    }

}
