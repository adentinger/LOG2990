import { expect } from 'chai';
import { CrosswordGame } from './crossword-game';
import { createMockGameConfigs } from './create-mock-game-configs';
import { CreateOrJoin, Difficulty, GameMode } from '../../../../../common/src/crossword/crossword-enums';

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

    it('should tell whether a certain player is in the game', () => {
        const GAME = new CrosswordGame({
            createJoin: CreateOrJoin.create,
            difficulty: Difficulty.easy,
            gameMode: GameMode.Classic,
            playerNumber: 2
        });
        const PLAYER1 = 'asdf123';
        const PLAYER2 = 'qwertyuiop';
        GAME.addPlayerToGame(PLAYER1);
        GAME.addPlayerToGame(PLAYER2);
        expect(GAME.isPlayerInGame(PLAYER1)).to.be.true;
        expect(GAME.isPlayerInGame(PLAYER2)).to.be.true;
        expect(GAME.isPlayerInGame('CHUCK NORRIS')).to.be.false;
    });
});
