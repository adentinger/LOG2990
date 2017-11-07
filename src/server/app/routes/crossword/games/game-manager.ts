import { CrosswordGameConfigs, GameId } from '../../../../../common/src/communication/game-configs';
import { Game } from './game';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { PacketManagerServer } from '../../../packet-manager';
import { GameJoinPacket } from '../../../../../common/src/crossword/packets/game-join.packet';
import '../../../../../common/src/crossword/packets/game-join.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { Player } from './player';

export class GameManager {

    private static instance: GameManager;
    private games: Map<number, Game> = new Map();
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    public static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    private constructor() {
        registerHandlers(this, this.packetManager);
    }

    public getGameConfigurations(): CrosswordGameConfigs[] {
        const gameConfigs: CrosswordGameConfigs[] = [];
        this.games.forEach((game) => {
            if (game.currentNumberOfPlayers < game.configuration.playerNumber) {
                gameConfigs.push(game.configuration);
            }
        });
        return gameConfigs;
    }

    public newGame(configs: CrosswordGameConfigs): GameId {
        const GAME = new Game(configs);
        this.games.set(GAME.id, GAME);
        return GAME.id;
    }

    public findGame(predicate: (game: Game) => boolean): Game {
        let foundGame = null;
        this.games.forEach((game) => {
            if (predicate(game)) {
                foundGame = game;
                return;
            }
        });
        return foundGame;
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
    // tslint:disable-next-line:no-unused-variable
    private gameJoinHandler(event: PacketEvent<GameJoinPacket>): void {
        const gameId = event.value.gameId;
        const GAME = this.getGameFromId(gameId);
        const playerName = event.value.playerName;

        GAME.addPlayer(new Player(playerName, event.socketid));
    }

    /**
     * Returning a gridword with an empty string field indicates a failed attempt
     * a filled string indicates a succesfull attempt
     * @param event
     */
    @PacketHandler(WordTryPacket)
    // tslint:disable-next-line:no-unused-variable
    private wordTryHandler(event: PacketEvent<WordTryPacket>) {
        const WORD_TRY: GridWord = event.value.wordTry;
        const PLAYER_ID: string = event.socketid;

        const game: Game = this.getGameFromPlayerId(PLAYER_ID);
        const ANSWER: GridWord = WORD_TRY;
        if (!game.validateUserAnswer(WORD_TRY)) {
            ANSWER.string = '';
        }
        // this.sendGridWord(ANSWER, PLAYER_ID);
    }

    private getGameFromId(id: GameId): Game {
        const game = this.games.get(id);
        if (game) {
            return game;
        }
        else {
            throw new Error(`Game "${id}" not found`);
        }
    }

    private getGameFromPlayerId(playerId: string): Game {
        let foundGame: Game = null;
        this.games.forEach((game) => {
            if (game.isSocketIdInGame(playerId)) {
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
