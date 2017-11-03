import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { Game } from './game';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { GameJoinPacket } from '../../../../../common/src/crossword/packets/game-join.packet';
import { PacketManagerServer } from '../../../packet-manager';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import '../../../../../common/src/crossword/packets/game-join.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';

export class GameManager {

    private static instance: GameManager;
    private games: Map<number, Game> = new Map();
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    private constructor() {
        registerHandlers(this, this.packetManager);
    }

    public static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public newGame(configs: CrosswordGameConfigs): number {
        const GAME = new Game(configs);
        this.games.set(GAME.id, GAME);
        return GAME.id;
    }

    public getGame(id: number): Game {
        if (this.games.has(id)) {
            return this.games.get(id);
        } else {
            return null;
        }
    }

    public getNumberOfActiveGames(): number {
        return this.games.size;
    }

    public deleteGame(id: number): boolean {
        return this.games.delete(id);
    }

    @PacketHandler(GameJoinPacket)
    public gameJoinHandler(event: PacketEvent<GameJoinPacket>): void {
        const gameId = event.value.gameId;
        if (gameId) {
            console.error(`Game ID ${event.value.gameId} invalid. Packet dropped.`);
            return;
        }
        const GAME = this.getGameFromId(gameId);
        const PLAYER_ID = event.socketid;

        GAME.addPlayer(PLAYER_ID);
    }

    /**
     * Returning a gridword with an empty string field indicates a failed attempt
     * a filled string indicates a succesfull attempt
     * @param event
     */
    @PacketHandler(WordTryPacket)
    public wordTryHandler(event: PacketEvent<WordTryPacket>) {
        const WORD_TRY: GridWord = event.value.wordTry;
        const PLAYER_ID: string = event.socketid;

        const game: Game = this.getGameFromPlayerId(PLAYER_ID);
        const ANSWER: GridWord = WORD_TRY;
        if (!game.validateUserAnswer(WORD_TRY)) {
            ANSWER.string = '';
        }
        // this.sendGridWord(ANSWER, PLAYER_ID);
    }

    private getGameFromId(id: number): Game {
        let foundGame: Game = null;
        this.games.forEach((game) => {
            if (game.id === id) {
                foundGame = game;
            }
        });
        if (foundGame !== null) {
            return foundGame;
        }
        else {
            throw new Error(`Game "${id}" not found`);
        }
    }

    private getGameFromPlayerId(playerId: string): Game {
        let foundGame: Game = null;
        this.games.forEach((game) => {
            if (game.isPlayerInGame(playerId)) {
                foundGame = game;
            }
        });
        if (foundGame !== null) {
            return foundGame;
        }
        else {
            throw new Error(`Player "${playerId}" not found in any game`);
        }
    }

}
