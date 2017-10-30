import { Injectable } from '@angular/core';

import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { ARRAY_GRIDWORD_H, ARRAY_GRIDWORD_V } from '../mocks/grid-mock';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { registerHandlers, PacketHandler, PacketEvent } from '../../../../../common/src/index';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { DefinitionsService } from '../definition-field/definitions.service';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import { SelectionService } from '../selection.service';

@Injectable()
export class CrosswordGridService {

    private static readonly BLACK_SQUARE = '0';
    private static readonly GRID_DIMENSION = 10;

    private horizontalGridWords: Map<number, GridWord>;
    private verticalGridWords:   Map<number, GridWord>;

    private gridWithoutUserInput: string[][] = [];

    constructor(private crosswordGameService: CrosswordGameService,
                private selectionService: SelectionService,
                private packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);

        // This mock is meant to stay as an initial view
        this.horizontalGridWords = new Map(ARRAY_GRIDWORD_H.map(
            (value: GridWord, index: number) => <[number, GridWord]>[index, value]));
        this.verticalGridWords = new Map(ARRAY_GRIDWORD_V.map(
            (value: GridWord, index: number) => <[number, GridWord]>[index, value]));

        this.gridWithoutUserInput = this.getViewableGrid();
    }

    public getViewableGrid(): string[][] {
        const VIEWABLE_GRID: string[][] = [];
        return VIEWABLE_GRID;
    }

    public getWord(index: number, direction: Direction): GridWord {
        if (direction === Direction.horizontal) {
            return this.horizontalGridWords.get(index);
        }
        else if (direction === Direction.vertical) {
            return this.verticalGridWords.get(index);
        }
        else {
            throw new Error('Unknown direction: "' + direction + '"');
        }
    }

    public setUserInput(input: string): void {
        // if (this.selectionService.hasSelectedWord) {
        //     const SELECTED_WORD = this.selectionService.selectionValue;
        //     if (input.length < SELECTED_WORD.length) {
        //         this.inputLettersOnGrid(SELECTED_WORD, input);
        //     }
        //     else if (input.length === SELECTED_WORD.length) {
        //         this.inputLettersOnGrid(SELECTED_WORD, input);
        //         this.sendWordToServer(input, SELECTED_WORD);
        //         this.selectionService.selection.next(SELECTED_WORD);
        //     }
        // }
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
