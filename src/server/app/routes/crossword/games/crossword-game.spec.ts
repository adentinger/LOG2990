import { expect } from 'chai';
import { CrosswordGame } from './crossword-game';
import { createMockGameConfigs } from './create-mock-game-configs';

describe('The Crossword Game', () => {
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

    it('should creates be able to provide basic informations', (done) => {
        expect(gameToTest.getGameInfo()).to.be.not.null;
        done();
    });
});
