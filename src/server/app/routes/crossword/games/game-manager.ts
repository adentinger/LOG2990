import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { CrosswordGame } from './crossword-game';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../common/index';
import { GameJoinPacket } from '../../../common/crossword/packets/game-join.packet';
import { GameDefinitionPacket } from '../../../common/crossword/packets/game-definition.packet';
import { PacketManagerServer } from '../../../packet-manager';
import '../../../common/crossword/packets/game-join.parser';
import { Definition } from '../../../common/crossword/definition';
import { Direction } from '../../../common/crossword/crossword-enums';

import '../../../common/crossword/packets/game-definition.parser';

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

        console.log('Player from socket ' + playerSocketId + ' requesting to join game: ' + gameToJoin);
        this.addPlayerToGame(event.socketid, gameToJoin);
        console.log(this.getGame(gameToJoin).getGameInfo());
        // send all definitions
        const definitions: Definition[] =
            this.games.get(gameToJoin).horizontalDefinitions
                .concat(this.games.get(gameToJoin).verticalDefinitions);

        // send 1 definition for testing;
        this.sendDefinition(0, Direction.horizontal, definitions[0], playerSocketId);

        // send all gridWords
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
}
