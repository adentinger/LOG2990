import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { CrosswordGame } from './crossword-game';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { GameJoinPacket } from '../../../../../common/src/crossword/packets/game-join.packet';
import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import { PacketManagerServer } from '../../../packet-manager';

import { Definition } from '../../../../../common/src/crossword/definition';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';


import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import '../../../../../common/src/crossword/packets/game-join.parser';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';

const ID_LENGTH = 8;

export class GameManager {

    // private crosswordGridGenerator:
    private static instance: GameManager;
    private games: Map<string, CrosswordGame> = new Map();
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

    public newGame(configs: CrosswordGameConfigs): string {
        let newId: string;
        do {
            newId = this.generateRandomString(ID_LENGTH);
        } while (this.games.has(newId));

        // TODO initialize game
        this.games.set(newId, new CrosswordGame(configs));
        return newId;
    }

    public getGame(id: string): CrosswordGame {
        if (this.games.has(id)) {
            return this.games.get(id);
        } else {
            return null;
        }
    }

    public getNumberOfActiveGames(): number {
        return this.games.size;
    }

    public deleteGame(id: string): boolean {
        return this.games.delete(id);
    }

    private generateRandomString(length: number): string {
        let text = '';
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return text;
    }

    @PacketHandler(GameJoinPacket)
    public gameJoinHandler(event: PacketEvent<GameJoinPacket>) {
        const gameToJoin = event.value.gameId;
        const playerSocketId = event.socketid;

        this.addPlayerToGame(event.socketid, gameToJoin);

        // send all gridWords
        const gridWord = new GridWord(7, 1, 1, 2, 0, 0, 'abc');
        this.sendGridWord(
            gridWord,
            playerSocketId);

        // send all definitions
        this.sendAllDefinitions(gameToJoin, playerSocketId);

    }

    /**
     * Returning a gridword with an empty string field indicates a failed attempt
     * a filled string indicates a succesfull attempt
     * @param event 
     */
    @PacketHandler(WordTryPacket)
    public wordTryHandler(event: PacketEvent<WordTryPacket>) {
        const wordTry: GridWord = event.value.wordTry;
        const socketId: string = event.socketid;
        console.log(wordTry);

        const game: CrosswordGame = this.getGameFromSocketId(event.socketid);

        let answerToServer: GridWord = wordTry;
        if (!game.validateUserAnswer(wordTry)) {
            answerToServer.string = '';
        }
        this.sendGridWord(answerToServer, socketId);
    }

    /**
     * Returns a game given the socketId of one of its player
     * @param socketId : Id of a player
     */
    private getGameFromSocketId(socketId: string): CrosswordGame {
        for (let game of this.games) {
            if (socketId === game[1].player1Id ||
                socketId === game[1].player2Id) {
                // console.log('found a game: ' + JSON.stringify(game[1]));
                return game[1];
            }
        }
        return null;
    }

    private sendAllDefinitions(gameId: string, socketId: string): void {
        const horizontalDefinitions: Map<number, Definition> = this.games.get(gameId).horizontalDefinitions;
        const verticalDefinitions: Map<number, Definition> = this.games.get(gameId).verticalDefinitions;

        for (let i = 0; i < horizontalDefinitions.size; i++) {
            this.sendDefinition(i, Direction.horizontal, horizontalDefinitions.get(i), socketId);
        }
        for (let i = 0; i < verticalDefinitions.size; i++) {
            this.sendDefinition(i, Direction.vertical, verticalDefinitions.get(i), socketId);
        }
    }

    private addPlayerToGame(playerId: string, gameId: string): void {
        this.games.get(gameId).player1Id = playerId;
    }

    private sendDefinition(index: number, direction: Direction, definition: Definition, socketId: string) {
        this.packetManager.sendPacket(
            GameDefinitionPacket,
            new GameDefinitionPacket(index, direction, definition),
            socketId);
    }

    private sendGridWord(gridWord: GridWord, socketId: string) {
        this.packetManager.sendPacket(
            GridWordPacket,
            new GridWordPacket(gridWord),
            socketId);
    }
}
