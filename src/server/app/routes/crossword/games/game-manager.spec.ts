import { expect } from 'chai';

import { GameManager } from './game-manager';
import { Game } from './game';
import { createMockGameConfigs } from './create-mock-game-configs';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';

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

    it('should make available a list of game configurations', () => {
        expect(gameManager.getGameConfigurations()).to.deep.equal([]);
        const CONFIGURATION: CrosswordGameConfigs = {
            playerName: 'Pascal Lacasse',
            difficulty: Difficulty.easy,
            gameId: undefined,
            gameMode: GameMode.Classic,
            playerNumber: 1
        };
        gameManager.newGame(CONFIGURATION);
        expect(gameManager.getGameConfigurations()).to.deep.equal(CONFIGURATION);
    });

    it('should return an id upon game creation', (done) => {
        const idObtained = gameManager.newGame(createMockGameConfigs());
        expect(idObtained).to.be.not.null;
        done();
    });

    it('should creates new games which are accessible by their ids', (done) => {
        const idObtained = gameManager.newGame(createMockGameConfigs());
        const game: Game = gameManager.getGame(idObtained);
        expect(game).to.be.not.null;
        done();
    });

    it('should return a game matching a predicate, or null if not found', () => {
        const idObtained = gameManager.newGame(createMockGameConfigs());
        expect(gameManager.findGame((game) => game.id === idObtained)).to.be.true;
        expect(gameManager.findGame((game) => game.id === idObtained - 1)).to.be.null;
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

        const nGames = Math.floor(Math.random() * MAX_N) + 1;
        const gameIds: number[] = [];
        for (let i = 0; i < nGames; i++) {
            gameIds.push(gameManager.newGame(createMockGameConfigs()));
        }
        const randomNumberToDelete = Math.floor(Math.random() * gameIds.length);
        const idToDelete = gameIds[randomNumberToDelete];
        gameManager.deleteGame(idToDelete);
        expect(gameManager.getNumberOfActiveGames()).to.equal(nGames - 1);
        expect(gameManager.getGame(idToDelete)).to.equal(null);
        done();
    });
});
