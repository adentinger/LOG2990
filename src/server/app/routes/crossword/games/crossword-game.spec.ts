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

    it('should be able to provide basic information', (done) => {
        expect(gameToTest.getGameInfo()).to.be.not.null;
        done();
    });

    describe('addPlayerToGame', () => {
        it('should players to the game', () => {
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
        });

        it('should not add more players to the game than the max number of players', () => {
            const GAME1PLAYER = new CrosswordGame({
                createJoin: CreateOrJoin.create,
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 1
            });
            const GAME2PLAYERS = new CrosswordGame({
                createJoin: CreateOrJoin.create,
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = 'TAM ARAR';
            const PLAYER2 = 'ERIC CHAO';
            GAME1PLAYER.addPlayerToGame(PLAYER1);
            expect(() => GAME1PLAYER.addPlayerToGame(PLAYER2)).to.throw;

            GAME2PLAYERS.addPlayerToGame(PLAYER1);
            GAME2PLAYERS.addPlayerToGame(PLAYER2);
            expect(() => GAME2PLAYERS.addPlayerToGame('PASCAL LACASSE')).to.throw;
        });
    });

    it('should tell whether a certain player is in the game', () => {
        const GAME = new CrosswordGame({
            createJoin: CreateOrJoin.create,
            difficulty: Difficulty.easy,
            gameMode: GameMode.Classic,
            playerNumber: 2
        });
        const PLAYER1 = 'ADAM CÔTÉ';
        const PLAYER2 = 'EMIR BELHADDAD';
        GAME.addPlayerToGame(PLAYER1);
        GAME.addPlayerToGame(PLAYER2);
        expect(GAME.isPlayerInGame(PLAYER1)).to.be.true;
        expect(GAME.isPlayerInGame(PLAYER2)).to.be.true;
        expect(GAME.isPlayerInGame('CHUCK NORRIS')).to.be.false;
    });
});
