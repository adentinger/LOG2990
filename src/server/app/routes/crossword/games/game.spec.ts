import { expect } from 'chai';
import { Game } from './game';
import { createMockGameConfigs } from './create-mock-game-configs';
import { CreateOrJoin, Difficulty, GameMode } from '../../../../../common/src/crossword/crossword-enums';

describe('The Crossword Game', () => {
    it('should be created', (done) => {
        const mockConfig = createMockGameConfigs();
        const game = new Game(mockConfig);
        expect(game).to.be.not.null;
        done();
    });

    let gameToTest: Game;
    beforeEach(() => {
        gameToTest = new Game(createMockGameConfigs());
    });

    it('should contain grid words', (done) => {
        expect(gameToTest.words).to.be.not.null;
        done();
    });

    describe('addPlayer', () => {
        it('should players to the game', () => {
            const GAME = new Game({
                createJoin: CreateOrJoin.create,
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = 'asdf123';
            const PLAYER2 = 'qwertyuiop';
            GAME.addPlayer(PLAYER1);
            GAME.addPlayer(PLAYER2);
            expect(GAME.isPlayerInGame(PLAYER1)).to.be.true;
            expect(GAME.isPlayerInGame(PLAYER2)).to.be.true;
        });

        it('should not add more players to the game than the max number of players', () => {
            const GAME1PLAYER = new Game({
                createJoin: CreateOrJoin.create,
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 1
            });
            const GAME2PLAYERS = new Game({
                createJoin: CreateOrJoin.create,
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = 'TAM ARAR';
            const PLAYER2 = 'ERIC CHAO';
            GAME1PLAYER.addPlayer(PLAYER1);
            expect(() => GAME1PLAYER.addPlayer(PLAYER2)).to.throw;

            GAME2PLAYERS.addPlayer(PLAYER1);
            GAME2PLAYERS.addPlayer(PLAYER2);
            expect(() => GAME2PLAYERS.addPlayer('PASCAL LACASSE')).to.throw;
        });
    });

    it('should tell whether a certain player is in the game', () => {
        const GAME = new Game({
            createJoin: CreateOrJoin.create,
            difficulty: Difficulty.easy,
            gameMode: GameMode.Classic,
            playerNumber: 2
        });
        const PLAYER1 = 'ADAM CÔTÉ';
        const PLAYER2 = 'EMIR BELHADDAD';
        GAME.addPlayer(PLAYER1);
        GAME.addPlayer(PLAYER2);
        expect(GAME.isPlayerInGame(PLAYER1)).to.be.true;
        expect(GAME.isPlayerInGame(PLAYER2)).to.be.true;
        expect(GAME.isPlayerInGame('CHUCK NORRIS')).to.be.false;
    });
});
