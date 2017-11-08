import { expect } from 'chai';
import { Game } from './game';
import { createMockGameConfigs } from './create-mock-game-configs';
import { Difficulty, GameMode } from '../../../../../common/src/crossword/crossword-enums';
import { Player } from './player';

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
        expect(gameToTest.data.words).to.be.not.null;
        done();
    });

    describe('addPlayer', () => {
        it('should players to the game', () => {
            const GAME = new Game({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = new Player('asdf123', '123a');
            const PLAYER2 = new Player('qwertyuiop', '123b');
            GAME.addPlayer(PLAYER1);
            GAME.addPlayer(PLAYER2);
            expect(GAME.isSocketIdInGame(PLAYER1.socketId)).to.be.true;
            expect(GAME.isSocketIdInGame(PLAYER2.socketId)).to.be.true;
        });

        it('should not add more players to the game than the max number of players', () => {
            const GAME1PLAYER = new Game({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 1
            });
            const GAME2PLAYERS = new Game({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = new Player('TAM ARAR', '123a');
            const PLAYER2 = new Player('ERIC CHAO', '123a');
            GAME1PLAYER.addPlayer(PLAYER1);
            expect(() => GAME1PLAYER.addPlayer(PLAYER2)).to.throw;

            GAME2PLAYERS.addPlayer(PLAYER1);
            GAME2PLAYERS.addPlayer(PLAYER2);
            expect(() => GAME2PLAYERS.addPlayer(new Player('PASCAL LACASSE', '123c'))).to.throw;
        });
    });

    it('should tell whether a certain player is in the game', () => {
        const GAME = new Game({
            difficulty: Difficulty.easy,
            gameMode: GameMode.Classic,
            playerNumber: 2
        });
        const PLAYER1 = new Player('ADAM CÔTÉ', '123a');
        const PLAYER2 = new Player('EMIR BELHADDAD', '123b');
        GAME.addPlayer(PLAYER1);
        GAME.addPlayer(PLAYER2);
        expect(GAME.isSocketIdInGame(PLAYER1.socketId)).to.be.true;
        expect(GAME.isSocketIdInGame(PLAYER2.socketId)).to.be.true;
        expect(GAME.isSocketIdInGame('CHUCK NORRIS')).to.be.false;
    });
});
