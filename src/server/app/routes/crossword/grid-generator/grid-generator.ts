/*--------------------------------
Crossword - minimal black cases X.
 _ _ _ _ _ _ _ _ _ _
|_|_|_|_|_|_|_|_|_|X|
|_|_|_|_|X|X|X|X|X|X|
|_|_|_|X|X|X|X|X|X|_|
|_|_|X|_|_|_|_|_|X|_|
|_|X|X|_|_|_|X|X|X|_|
|_|X|X|_|_|_|_|_|X|_|
|X|X|X|_|_|_|X|X|X|_|
|X|X|X|X|X|X|_|_|_|X|
|X|X|X|X|X|_|_|_|_|X|
|X|_|_|_|_|_|_|_|_|X|
--------------------------------*/
// For no confusion : Case = State, there is 3 Cases in the following code; one for each part of the grid.

import { readFileSync } from 'fs';
//export const lexicon = readFileSync('englishWords.txt', 'utf8').toString().split('\n');
import { lexicon } from './englishWords';
import { Word } from './word';
import { getRandomIndex, getWordOfDesiredLength, formatGrid } from './lexique';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';

/*
import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';

@MiddleWare
export class GridGeneratorMiddleWare {
    @Route('get', '/crossword/grid')
    public pending(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send(new Grid(10));
    }
}
*/

export class Grid {
    public temporaryGridForAcross: Word[] = [];
    public temporaryGridForVertical: Word[] = [];
    public gridForAcross: Word[] = [];
    public gridForVertical: Word[] = [];
    public grid: string[][] = [];
    public gridForPosition: Array<[number, number]>[] = [];

    constructor(private size: number) {
        for (let i = 0; i < size; i++) {
            this.grid[i] = new Array<string>(size);
        }

        for (let i = 0; i < size; i++) {
            this.gridForPosition[i] = new Array<[number, number]>(size);
        }
        this.gridGeneration();
    }

    public gridGeneration() {
        // the grid is separated in three cases + a final word push
        const firstGrid = new GridFillerFirstSection(this);
        this.temporaryGridForVertical = firstGrid.temporaryGridForVertical;
        this.temporaryGridForAcross = firstGrid.temporaryGridForAcross;
        this.pushOnTheGridAndReinitialiseTemporaryGrid();

        const secondGrid = new GridFillerSecondSection(this);
        this.temporaryGridForVertical = secondGrid.temporaryGridForVertical;
        this.temporaryGridForAcross = secondGrid.temporaryGridForAcross;
        this.pushOnTheGridAndReinitialiseTemporaryGrid();

        const thirdGrid = new GridFillerThirdSection(this);
        this.temporaryGridForVertical = thirdGrid.temporaryGridForVertical;
        this.temporaryGridForAcross = thirdGrid.temporaryGridForAcross;
        this.pushOnTheGridAndReinitialiseTemporaryGrid();

        this.gridForVertical.push(getWordOfDesiredLength(4, 5, this));
        /*
        this.initialisation(2);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        this.initialisation(3);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        */
        // finaly we push a word on last column

        //console.info(this.gridForPosition);
        this.putWordAcrossAndVerticalOnGridForPrintingOut();
        // prints out
        console.dir(this.gridForVertical);
        console.dir(this.gridForAcross);
        formatGrid(this);
        console.dir(this.grid);
    }

    public putWordAcrossAndVerticalOnGridForPrintingOut() {
        for (let i = 0; i < this.gridForVertical.length; i++) {
            this.putWordVertical(this.gridForVertical[i], i);
        }

        for (let i = 0; i < this.gridForAcross.length; i++) {
            this.putWordAcross(this.gridForAcross[i], i);
        }
    }

    public putWordVertical(word: Word, column: number) {

        let rowToWriteOn: number;
        if ((column >= 0) && (column <= 2)) {
            rowToWriteOn = 0;
        }else if ((column >= 3) && (column <= 5)) {
            rowToWriteOn = 3;
        }else if ((column >= 6) && (column <= 8)) {
            rowToWriteOn = 7;
        }else if (column === 9) {
            rowToWriteOn = 2;
        }

        word.position = [rowToWriteOn, column];

        for (let i = 0; i < word.value.length; i++) {
            this.grid[rowToWriteOn + i][column] = word.value[i];
        }
    }

    public putWordAcross(word: Word, row: number) {

        let columnToWriteOn: number;
        if ((row >= 0) && (row <= 2)) {
            columnToWriteOn = 0;
        }else if ((row >= 3) && (row <= 6)) {
            columnToWriteOn = 3;
        }else if ((row >= 7) && (row <= 9)) {
            columnToWriteOn = 8;
        }
        console.log('BONJOURR')
        console.log(word)
        if (row < 7) {
            word.position = [row, columnToWriteOn];
            for (let i = 0; i < word.value.length; i++) {
                this.grid[row][columnToWriteOn + i] = word.value[i];
            }
        }else {
            let wordIndex = word.value.length - 1;
            for (let i = 0; i < word.value.length; i++) {
                this.grid[row][columnToWriteOn - i] = word.value[wordIndex];
                wordIndex--;
            }
            word.position = [row, columnToWriteOn - (word.value.length - 1)];
        }
    }

    public pushOnTheGridAndReinitialiseTemporaryGrid() {
        if (this.gridForVertical.length === 6) { // for Case three
            this.temporaryGridForVertical.reverse();
        }
        for (let i = 0; i < this.temporaryGridForVertical.length; i ++) {
            this.gridForVertical.push(this.temporaryGridForVertical[i]);
        }
        for (let i = 0; i < this.temporaryGridForAcross.length; i ++) {
            this.gridForAcross.push(this.temporaryGridForAcross[i]);
        }

        this.temporaryGridForAcross = [];
        this.temporaryGridForVertical = [];
    }
    public pushOnTheTemporaryGridAcrossWordsSuggestions(wordsSuggestions: string[]) {
        for (let i = 0; i < wordsSuggestions.length; i++) {
            this.temporaryGridForAcross.push(new Word(wordsSuggestions[i]));
        }
    }



    public alreadyChoosen(wordToCheck: string) {
        let alreadyChoosen = false;
        let allWords: string[] = [];

            for (let i = 0; i < this.gridForAcross.length; i++) {
                allWords.push(this.gridForAcross[i].value);
            }

            for (let i = 0; i < this.gridForVertical.length; i++) {
                allWords.push(this.gridForVertical[i].value);
            }

            for (let i = 0; i < allWords.length; i++) {
                if (allWords[i] === wordToCheck){
                    alreadyChoosen = true;
                }
            }

        return alreadyChoosen;
    }
}

const puzzle = new Grid(10);
