import { expect } from 'chai';
import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { CrosswordGame } from './crossword-game';
import { createMockGameConfigs } from './create-mock-game-configs';

describe('The crossword game', () => {
    it('should be created', (done) => {
        const mockConfig = createMockGameConfigs();
        const game = new CrosswordGame(mockConfig);
        expect(game).to.be.not.null;
        done();
    });

    let gameToTest: CrosswordGame;
    beforeEach(() => {
        gameToTest = new CrosswordGame(createMockGameConfigs());
    });

    it('should contain horizontal and vertical grid words', (done) => {
        expect(gameToTest.horizontalGridWords).to.be.not.null;
        expect(gameToTest.verticalGridWords).to.be.not.null;
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
        // console.log('max n:' + MAX_N);

        const nGames = Math.floor(Math.random() * MAX_N) + 1;
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
