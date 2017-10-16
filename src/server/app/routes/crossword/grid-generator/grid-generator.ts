import { Word } from './word';
import { WordCaller} from './word-caller';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { Grid, Difficulty } from './grid';

export class GridGenerator {
    public gridDisplay: string[][] = [];
    public grid: Grid;
    public wordsPositionVertical: [number, number, number][];
    public wordsPositionHorizontal: [number, number, number][];
    public difficulty: Difficulty;
    public isCommon: boolean;
    public wordCaller: WordCaller;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
        for (let i = 0; i < 10; i++) {
            this.gridDisplay[i] = new Array<string>(10);
        }
        if (difficulty === Difficulty.easy || difficulty === Difficulty.normal) {
            this.isCommon = true;
        }
        else if (difficulty === Difficulty.hard) {
            this.isCommon = false;
        }
        this.wordsPositionVertical = [[0, 2, 0], [3, 5, 3], [6, 8, 7], [9, 9, 2]];
        this.wordsPositionHorizontal = [[0, 2, 0], [3, 6, 3], [7, 9, 8]];
        this.grid = new Grid(this.difficulty);
        this.wordCaller = new WordCaller();
    }

    public async gridGeneration(): Promise<Grid> {
        // the grid is separated in three cases + a final word push
        const firstGrid = new GridFillerFirstSection(this, this.isCommon);
        this.pushOnTheGridAndReinitialiseTemporaryGrid(firstGrid.temporaryGridForVertical, firstGrid.temporaryGridForAcross);

        const secondGrid = new GridFillerSecondSection(this, this.isCommon);
        this.pushOnTheGridAndReinitialiseTemporaryGrid(secondGrid.temporaryGridForVertical, secondGrid.temporaryGridForAcross);

        const thirdGrid = new GridFillerThirdSection(this, this.isCommon);
        this.pushOnTheGridAndReinitialiseTemporaryGrid(thirdGrid.temporaryGridForVertical, thirdGrid.temporaryGridForAcross);

        this.grid.gridForVertical.push(this.wordCaller.getWordOfDesiredLength(4, 5, this));

        this.putWordAcrossAndVerticalOnGridForPrintingOut();
        // prints out
        console.dir(this.grid.gridForVertical);
        console.dir(this.grid.gridForAcross);
        this.wordCaller.formatGrid(this);
        console.dir(this.gridDisplay);
        return this.grid;
    }

    public putWordAcrossAndVerticalOnGridForPrintingOut() {
        for (let i = 0; i < this.grid.gridForVertical.length; i++) {
            this.putWordVertical(this.grid.gridForVertical[i], i);
        }

        for (let i = 0; i < this.grid.gridForAcross.length; i++) {
            this.putWordAcross(this.grid.gridForAcross[i], i);
        }
    }

    public putWordVertical(word: Word, column: number) {

        let row: number;
        for (let index = 0; index < this.wordsPositionVertical.length; index++) {
            if (column >= this.wordsPositionVertical[index][0] &&
                 column <= this.wordsPositionVertical[index][1]) {
                     row = this.wordsPositionVertical[index][2];
                    word.position = [this.wordsPositionVertical[index][2], column];
             }
        }

        for (let i = 0; i < word.value.length; i++) {
            this.gridDisplay[row + i][column] = word.value[i];
        }
    }

    public putWordAcross(word: Word, row: number) {

        let column: number;
        for (let index = 0; index < this.wordsPositionHorizontal.length; index++) {
            if (row >= this.wordsPositionHorizontal[index][0] &&
                row <= this.wordsPositionHorizontal[index][1]) {
                column = this.wordsPositionHorizontal[index][2];
                if (row < 7) {
                    column = this.wordsPositionHorizontal[index][2];
                    word.position = [row, this.wordsPositionHorizontal[index][2]];
                }
                else {
                    column = this.wordsPositionHorizontal[index][2] - (word.value.length - 1);
                    word.position = [row, this.wordsPositionHorizontal[index][2] - (word.value.length - 1)];
                }
            }
        }

        if (row < 7) {
            for (let i = 0; i < word.value.length; i++) {
                this.gridDisplay[row][column + i] = word.value[i];
            }
        }
        else {
            let wordIndex = word.value.length - 1;
            for (let i = 0; i < word.value.length; i++) {
                this.gridDisplay[row][column + i] = word.value[i];
                wordIndex--;
            }
        }
    }

    public pushOnTheGridAndReinitialiseTemporaryGrid(temporaryGridForVertical: Word[], temporaryGridForAcross: Word[]) {
        if (this.grid.gridForVertical.length === 6) { // for Case three
            temporaryGridForVertical.reverse();
        }
        for (let i = 0; i < temporaryGridForVertical.length; i ++) {
            this.grid.gridForVertical.push(temporaryGridForVertical[i]);
        }
        for (let i = 0; i < temporaryGridForAcross.length; i ++) {
            this.grid.gridForAcross.push(temporaryGridForAcross[i]);
        }
    }

}
