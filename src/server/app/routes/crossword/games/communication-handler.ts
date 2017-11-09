import '../../../../../common/src/crossword/packets/timer.parser';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import { ClearGridPacket } from '../../../../../common/src/crossword/packets/clear-grid.packet';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import { GameStartPacket } from '../../../../../common/src/crossword/packets/game-start.packet';
import '../../../../../common/src/crossword/packets/game-start.parser';
import { PacketManagerServer } from '../../../packet-manager';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { DefinitionWithIndex } from './game-data';
import { Player } from './player';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { SelectedWordPacket } from '../../../../../common/src/crossword/packets/selected-word.packet';
import '../../../../../common/src/crossword/packets/selected-word.parser';
import { TimerPacket } from '../../../../../common/src/crossword/packets/timer.packet';
import '../../../../../common/src/crossword/packets/timer.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try-result.parser';

export class CommunicationHandler {

    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    constructor() {
        this.packetManager = PacketManagerServer.getInstance();
    }

    public async clearPlayerGrid(playerId: string): Promise<void> {
        this.packetManager.sendPacket(ClearGridPacket, new ClearGridPacket(), playerId);
    }

    public sendGameStart(players: Player[]) {
        players.forEach((player) => {
            this.packetManager.sendPacket(GameStartPacket, new GameStartPacket(), player.socketId);
        });
    }

    public sendGridWords(socketId: string, gridwords: GridWord[]): void {
        gridwords.forEach((gridword) => {
            this.packetManager.sendPacket(
                GridWordPacket,
                new GridWordPacket(gridword),
                socketId
            );
        }
        );
    }

    public sendDefinitions(socketId: string, definitions: DefinitionWithIndex[]): void {
        const definitionsWithIndex = definitions;
        definitionsWithIndex.forEach((definitionWithIndex) => {
            const index = definitionWithIndex.index;
            const definition = definitionWithIndex.definition;
            this.packetManager.sendPacket(
                GameDefinitionPacket,
                new GameDefinitionPacket(index, definition.direction, definition),
                socketId
            );
        });
    }

    public updateOpponentSelectionOf(player: Player,
                                     selectionId: number,
                                     selectionDirection: Direction): void {
        this.packetManager.sendPacket(
            SelectedWordPacket,
            new SelectedWordPacket(selectionDirection, selectionId),
            player.socketId
        );
    }

    public sendFoundWord(foundWord: GridWord, finder: Player, opponent: Player = null): void {
        foundWord.owner = Owner.player1;
        const finderPacket = new WordTryPacket(foundWord);
        this.packetManager.sendPacket(
            WordTryPacket,
            finderPacket,
            finder.socketId
        );
        if (opponent) {
            const opponentPacket = new WordTryPacket(new GridWord(
                foundWord.id,
                foundWord.y,
                foundWord.x,
                foundWord.length,
                foundWord.direction,
                Owner.player2,
                foundWord.string
            ));
            this.packetManager.sendPacket(
                WordTryPacket,
                opponentPacket,
                opponent.socketId
            );
        }
    }

    public sendNewTimerValueTo(player: Player, countdown: number): void {
        this.packetManager.sendPacket(
            TimerPacket,
            new TimerPacket(countdown), player.socketId
        );
    }

}
