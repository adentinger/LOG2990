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

    public crosswordGrid: string[][];
    public horizontalGridWords: Map<number, GridWord>;
    public verticalGridWords: Map<number, GridWord>;

    private wordIsFound = false;
    private viewableGrid: string[][] = [];

    constructor(private crosswordGameService: CrosswordGameService,
                private selectionService: SelectionService,
                private packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);

        // This mock is meant to stay as an initial view
        this.horizontalGridWords = new Map(ARRAY_GRIDWORD_H.map(
            (value: GridWord, index: number) => <[number, GridWord]>[index, value]));
        this.verticalGridWords = new Map(ARRAY_GRIDWORD_V.map(
            (value: GridWord, index: number) => <[number, GridWord]>[index, value]));
    }

    public getViewableGrid(): string[][] {
        this.generateViewableGridTemplate();
        this.fillViewableGrid();
        return this.viewableGrid;
    }

    private fillViewableGrid() {
        this.fillViewableGridWithSpaces();
        for (let i = 0; i < this.horizontalGridWords.size; i++) {
            const gridWordToInsert: GridWord = this.horizontalGridWords.get(i);
            if (gridWordToInsert.string.length !== 0) {
                this.fillHorizontal(gridWordToInsert);
            }
        }
        for (let i = 0; i < this.verticalGridWords.size; i++) {
            const gridWordToInsert: GridWord = this.verticalGridWords.get(i);
            if (gridWordToInsert.string.length !== 0) {
                this.fillVertical(gridWordToInsert);
            }
        }
    }

    private fillViewableGridWithSpaces(): void {
        // Create empty spaces for the words
        for (let j = 0; j < this.horizontalGridWords.size; j++) {
            const gridWord: GridWord = this.horizontalGridWords.get(j);
            for (let i = 0; i < gridWord.length; i++) {
                this.viewableGrid[gridWord.y][i + gridWord.x] = '';
            }
        }
        for (let j = 0; j < this.verticalGridWords.size; j++) {
            const gridWord: GridWord = this.verticalGridWords.get(j);
            for (let i = 0; i < gridWord.length; i++) {
                this.viewableGrid[i + gridWord.y][gridWord.x] = '';
            }
        }
    }

    private fillHorizontal(gridWord: GridWord): void {
        for (let i = 0; i < gridWord.string.length; i++) {
            this.viewableGrid[gridWord.y][gridWord.x + i] = gridWord.string[i];
        }
    }

    private fillVertical(gridWord: GridWord): void {
        for (let i = 0; i < gridWord.length; i++) {
            this.viewableGrid[gridWord.y + i][gridWord.x] = gridWord.string[i];
        }
    }

    /**
     * Generate a viewable grid filled with zeroes (black squares)
     */
    private generateViewableGridTemplate() {
        this.viewableGrid = [];
        for (let i = 0; i < CrosswordGridService.GRID_DIMENSION; i++) {
            this.viewableGrid[i] = [];
            for (let j = 0; j < CrosswordGridService.GRID_DIMENSION; j++) {
                this.viewableGrid[i][j] = CrosswordGridService.BLACK_SQUARE;
            }
        }
    }

    public userInput(input: string, word: GridWord) {
        if (this.selectionService.hasSelectedWord) {
            if (input.length < word.length) {
                this.inputLettersOnGrid(word, input);
            }
            else if (input.length === word.length) {
                this.inputLettersOnGrid(word, input);
                this.sendWordToServer(input, word);
                this.selectionService.selection.next(word);
            }
        }
    }

    public inputLettersOnGrid(word: GridWord, input: string): void {
        for (let i = 0; i < word.length; i++) {
            if (word.direction === Direction.horizontal) {
                if (i < input.length) {
                    this.crosswordGrid[word.y][word.x + i] = input[i];
                }
                else {
                    this.crosswordGrid[word.y][word.x + i] = '';
                }
            }
            else if (word.direction === Direction.vertical) {
                if (i < input.length) {
                    this.crosswordGrid[word.y + i][word.x] = input[i];
                }
                else {
                    this.crosswordGrid[word.y + i][word.x] = '';
                }
            }
        }
    }

    public clearGridOfUselessLetters(): void {
        const words = [...this.horizontalGridWords.values(), ...this.verticalGridWords.values()];

        for (let i = 0; i < words.length; i++) {
            if (words[i].string === '') {
                this.inputLettersOnGrid(words[i], '');
            }
        }
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
