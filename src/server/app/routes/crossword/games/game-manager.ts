import { CrosswordGameConfigs, GameId } from '../../../../../common/src/communication/game-configs';
import { Game } from './game';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { PacketManagerServer } from '../../../packet-manager';
import { GameJoinPacket, WordGuessPacket } from '../../../../../common/src/crossword/packets';
import { Player } from './player';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { GameMode } from '../../../../../common/src/crossword/crossword-enums';
import { GameClassic } from './game-classic';

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
        this.packetManager.registerDisconnectHandler((socketId: string) => {
            this.handleDisconnect(socketId);
        });
    }

    public filterPendingGames(filter: GameFilter): Game[] {
        const matchingGames: Game[] = [];
        this.games.forEach((game) => {
            const isGameFull =
                game.currentNumberOfPlayers >= game.configuration.playerNumber;
            if (!isGameFull && game.matchesFilter(filter)) {
                matchingGames.push(game);
            }
        });
        return matchingGames;
    }

    public newGame(configs: CrosswordGameConfigs): GameId {
        let game: Game;
        switch (configs.gameMode) {
            default: // fallthrough
            case GameMode.Classic: {
                game = new GameClassic(configs);
                break;
            }
            case GameMode.Dynamic: {
                game = new GameClassic(configs);
                break;
            }
        }
        this.games.set(game.id, game);
        return game.id;
    }

    private handleDisconnect(socketId: string): void {
        this.games.forEach((game, id) => {
            if (game.isSocketIdInGame(socketId)) {
                game.deletePlayerBySocketid(socketId);
                if (game.currentNumberOfPlayers <= 0) {
                    return this.games.delete(id);
                }
            }
        });
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

    public getGame(id: GameId): Game {
        if (this.games.has(id)) {
            return this.games.get(id);
        } else {
            return null;
        }
    }

    public getNumberOfActiveGames(): number {
        return this.games.size;
    }

    @PacketHandler(GameJoinPacket)
    // tslint:disable-next-line:no-unused-variable
    private gameJoinHandler(event: PacketEvent<GameJoinPacket>): void {
        const gameId = event.value.gameId;
        const game = this.getGame(gameId);
        const playerName = event.value.playerName;

        game.addPlayer(new Player(playerName, event.socketid));
    }

    /**
     * Returning a gridword with an empty string field indicates a failed attempt
     * a filled string indicates a succesfull attempt
     * @param event
     */
    @PacketHandler(WordGuessPacket)
    // tslint:disable-next-line:no-unused-variable
    private wordGuessHandler(event: PacketEvent<WordGuessPacket>) {
        const wordGuess: GridWord = event.value.wordGuess;

        const foundGame = this.findGame((game) => game.isSocketIdInGame(event.socketid));
        foundGame.validateUserAnswer(wordGuess, event.socketid);
    }

}
