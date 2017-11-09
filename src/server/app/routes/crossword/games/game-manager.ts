import { CrosswordGameConfigs, GameId } from '../../../../../common/src/communication/game-configs';
import { Game } from './game';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { PacketManagerServer } from '../../../packet-manager';
import { GameJoinPacket } from '../../../../../common/src/crossword/packets/game-join.packet';
import '../../../../../common/src/crossword/packets/game-join.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { SelectedWordPacket } from '../../../../../common/src/crossword/packets/selected-word.packet';
import '../../../../../common/src/crossword/packets/selected-word.parser';
import { Player } from './player';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { TimerPacket } from '../../../../../common/src/crossword/packets/timer.packet';

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
        const GAME = new Game(configs);
        this.games.set(GAME.id, GAME);
        return GAME.id;
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
        const GAME = this.getGame(gameId);
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

        const foundGame = this.findGame((game) => game.isSocketIdInGame(event.socketid));
        foundGame.validateUserAnswer(WORD_TRY, event.socketid);
    }

    @PacketHandler(SelectedWordPacket)
    // tslint:disable-next-line:no-unused-variable
    private selectedWordHandler(event: PacketEvent<SelectedWordPacket>): void {
        const foundGame =
            this.findGame((game) => game.isSocketIdInGame(event.socketid));
        const foundPlayer =
            foundGame.findPlayer(player => player.socketId === event.socketid);
        foundGame.updateSelectionOf(foundPlayer, event.value.id, event.value.direction);
    }

    @PacketHandler(TimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private getCheatModeTimerValue(event: PacketEvent<TimerPacket>) {
        const foundGame = this.findGame(game => game.isSocketIdInGame(event.socketid));
        if (foundGame !== null) {
            // TODO update timer.
        }
        else {
            throw new Error(`No game with socket ID ${event.socketid} found`);
        }
    }

}
