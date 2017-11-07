import { Injectable } from '@angular/core';

import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { mockHorizontalGridWords, mockVerticalGridWords } from '../mocks/grid-mock';
import { PacketManagerClient } from '../../packet-manager-client';
import { registerHandlers, PacketHandler, PacketEvent } from '../../../../../common/src/index';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import { ClearGridPacket } from '../../../../../common/src/crossword/packets/clear-grid.packet';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import { Grid } from './grid';

@Injectable()
export class GridService {

    private readonly GRID = new Grid();
    private callbacks: (() => void)[] = [];

    constructor(private packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);

        // This mock is meant to stay as an initial view
        mockHorizontalGridWords().forEach((word) => {
            this.GRID.addWord(word);
        });
        mockVerticalGridWords().forEach((word) => {
            this.GRID.addWord(word);
        });
    }

    public getCharAt(row: number, column: number): string {
        return this.GRID.getCharAt(row, column);
    }

    public getWord(index: number, direction: Direction): GridWord {
        return this.GRID.getWord(index, direction);
    }

    public setUserInput(word: GridWord): void {
        this.GRID.userInput = word;
        if (word.length === word.string.length) {
            this.sendWordToServer(word);
        }
    }

    public addOnChangeCallback(callback: () => void): void {
        this.callbacks.push(callback);
    }

    public checkIfWordIsFound(wordId: number, wordDirection: Direction): boolean {
        return this.GRID.getWord(wordId, wordDirection).owner !== Owner.none;
    }

    private sendWordToServer(word: GridWord): void {
        this.packetManager.sendPacket(WordTryPacket, new WordTryPacket(word));
    }

    private onChange(): void {
        this.callbacks.forEach((callback) => callback());
    }

    @PacketHandler(GridWordPacket)
    // tslint:disable-next-line:no-unused-variable
    private updateGridWord(event: PacketEvent<GridWordPacket>): void {
        this.GRID.addWord(event.value.gridword);
        this.onChange();
    }

    @PacketHandler(ClearGridPacket)
    // tslint:disable-next-line:no-unused-variable
    private clearGrid(): void {
        this.GRID.empty();
        this.onChange();
    }

    @PacketHandler(WordTryPacket)
    // tslint:disable-next-line:no-unused-variable
    private wordWasFound(event: PacketEvent<WordTryPacket>): void {
        this.GRID.updateWord(event.value.wordTry);
        this.onChange();
    }

    public getPlayerWordsFoundCount() {
        return this.GRID.getPlayerWordsFoundCount();
    }

    public getOpponentWordsFoundCount() {
        return this.GRID.getOpponentWordsFoundCount();
    }

}
