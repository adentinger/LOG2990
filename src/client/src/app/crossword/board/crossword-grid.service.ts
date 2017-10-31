import { Injectable } from '@angular/core';

import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { ARRAY_GRIDWORD_H, ARRAY_GRIDWORD_V } from '../mocks/grid-mock';
import { PacketManagerClient } from '../../packet-manager-client';
import { registerHandlers, PacketHandler, PacketEvent } from '../../../../../common/src/index';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import { Grid } from './grid';

@Injectable()
export class CrosswordGridService {

    private readonly GRID = new Grid();

    constructor(private packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);

        // This mock is meant to stay as an initial view
        ARRAY_GRIDWORD_H.forEach((word) => {
            this.GRID.addWord(word);
        });
        ARRAY_GRIDWORD_V.forEach((word) => {
            this.GRID.addWord(word);
        });
    }

    public getCharAt(row: number, column: number): string {
        return this.GRID.getCharAt(row, column);
    }

    public getWord(index: number, direction: Direction): GridWord {
        return this.GRID.getWord(index, direction);
    }

    public setUserInput(input: string): void {
        this.GRID.userInput = input;
    }

    public sendWordToServer(input: string, word: GridWord) {
        const newGridWord = Object.assign(new GridWord, word);
        newGridWord.string = input;

        this.packetManager.sendPacket(WordTryPacket, new WordTryPacket(newGridWord));
    }

    @PacketHandler(GridWordPacket)
    public updateGridWord(event: PacketEvent<GridWordPacket>) {
        console.log('new gridword received from server: ' + JSON.stringify(event.value.gridword));
        // send change to grid
    }

}
