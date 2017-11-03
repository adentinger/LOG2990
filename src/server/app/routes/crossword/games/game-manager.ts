import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { CrosswordGame } from './crossword-game';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { GameJoinPacket } from '../../../../../common/src/crossword/packets/game-join.packet';
import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import { PacketManagerServer } from '../../../packet-manager';

import { Definition } from '../../../../../common/src/crossword/definition';


import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import '../../../../../common/src/crossword/packets/game-join.parser';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';

const ID_LENGTH = 8;

export class GameManager {

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
    public gameJoinHandler(event: PacketEvent<GameJoinPacket>): void {
        const GAME_ID = Number(event.value.gameId);
        if (Number.isNaN(GAME_ID)) {
            console.error(`Game ID ${event.value.gameId} invalid. Packet dropped.`);
            return;
        }
        const GAME = this.getGameFromId(GAME_ID);
        const PLAYER_ID = event.socketid;

        GAME.addPlayer(PLAYER_ID);

        this.sendAllGridWords(GAME, PLAYER_ID);
        this.sendAllDefinitions(GAME, PLAYER_ID);
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

        const game: CrosswordGame = this.getGameFromPlayerId(event.socketid);
        const ANSWER: GridWord = wordTry;
        if (!game.validateUserAnswer(wordTry)) {
            ANSWER.string = '';
        }
        this.sendGridWord(ANSWER, socketId);
    }

    private getGameFromId(id: number): CrosswordGame {
        let foundGame: CrosswordGame = null;
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

    /**
     * Returns a game given the socketId of one of its player
     * @param socketId : Id of a player
     */
    private getGameFromPlayerId(playerId: string): CrosswordGame {
        let foundGame: CrosswordGame = null;
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

    private sendAllDefinitions(game: CrosswordGame, socketId: string): void {
        const DEFINITIONS_WITH_INDEX = game.definitions;
        DEFINITIONS_WITH_INDEX.forEach((definitionWitnIndex) => {
            this.sendDefinition(
                definitionWitnIndex.index,
                definitionWitnIndex.definition,
                socketId
            );
        });
    }

    private sendDefinition(index: number, definition: Definition, socketId: string) {
        this.packetManager.sendPacket(
            GameDefinitionPacket,
            new GameDefinitionPacket(index, definition.direction, definition),
            socketId
        );
    }

    private sendAllGridWords(game: CrosswordGame, playerId: string): void {
        const WORDS = game.words;
        WORDS.forEach((word) => {
            this.sendGridWord(word, playerId);
        });
    }

    private sendGridWord(gridWord: GridWord, socketId: string) {
        this.packetManager.sendPacket(
            GridWordPacket,
            new GridWordPacket(gridWord),
            socketId
        );
    }
}
