import { expect } from 'chai';
import { GameManager } from './game-manager';
import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { CrosswordGame } from './crossword-game';

const CONFIG_MOCK: CrosswordGameConfigs = {
    gameMode: 'classic',
    playerNumber: '1',
    createJoin: 'create',
    difficulty: 'easy'
};

function createMockGameConfigs(): CrosswordGameConfigs {
    const gameModes = ['classic', 'dynamic'];
    const playerNumbers = ['1', '2'];
    const createJoinChoices = ['create', 'join'];
    const difficulties = ['easy', 'normal', 'brutal'];

    const randGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    const randPlayerNumber = playerNumbers[Math.floor(Math.random() * playerNumbers.length)];
    const randCreateJoin = createJoinChoices[Math.floor(Math.random() * createJoinChoices.length)];
    const randDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const config: CrosswordGameConfigs = {
        gameMode: randGameMode,
        playerNumber: randPlayerNumber,
        createJoin: randCreateJoin,
        difficulty: randDifficulty
    };
    return config;
}

describe('The Game Manager Service', () => {
    it('should be created', (done) => {
        const CONSTRUCTOR = () => GameManager.getInstance();
        expect(CONSTRUCTOR).to.not.throw();
        done();
    });

    const gameManager: GameManager = GameManager.getInstance();
    beforeEach(() => {
        gameManager['games'].clear();
    });

    it('should return an id upon game creation', (done) => {
        const idObtained: string = gameManager.newGame(createMockGameConfigs());
        expect(idObtained).to.be.not.null;
        done();
    });

    it('should creates new games which are accessible by their ids', (done) => {
        const idObtained: string = gameManager.newGame(createMockGameConfigs());
        const game: CrosswordGame = gameManager.getGame(idObtained);
        expect(game).to.be.not.null;
        done();
    });

    it('should keep track of the number of game created', (done) => {
        const MAX_N = 8;
        const nGames = Math.floor(Math.random() * MAX_N);
        for (let i = 0; i < nGames; i++) {
            gameManager.newGame(createMockGameConfigs());
        }
        expect(gameManager.getNumberOfActiveGames()).to.be.equal(nGames);
        done();
    });

    it('should be able to delete a specific game among others', (done) => {
        const MAX_N = 8;
        const nGames = Math.floor(Math.random() * MAX_N);
        const gameIds: string[] = [];
        for (let i = 0; i < nGames; i++) {
            gameIds.push(gameManager.newGame(createMockGameConfigs()));
        }
        const randomNumberToDelete = Math.floor(Math.random() * gameIds.length);
        const idToDelete: string = gameIds[randomNumberToDelete];
        gameManager.deleteGame(idToDelete);
        expect(gameManager.getNumberOfActiveGames()).to.equal(nGames - 1);
        expect(gameManager.getGame(idToDelete)).to.equal(null);
        done();
    });
});
