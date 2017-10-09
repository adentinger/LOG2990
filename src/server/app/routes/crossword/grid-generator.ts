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

    /*
    public returnArrayOfWordsThatFitsAcross(onColumnNow: number, caseNumber: number) {
        const firstLettersWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];
        let untilWhichRow = 0;

        if (caseNumber === 1) {
            untilWhichRow = 3;
        }else if (caseNumber === 2) {
            untilWhichRow = 4;
        }else if (caseNumber === 3) {
            untilWhichRow = 3;
        }

        for (let row = 0; row < untilWhichRow; row++) { // for the first rows of the grid
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column].value[row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];
            let returnedWord;
            if (caseNumber === 1) {
                returnedWord = this.returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordOnAcrossString, row);
            }else if (caseNumber === 2) {
                returnedWord = this.returnARandomWordFromSuggestionsCaseTwo(beginningOfTheWordOnAcrossString, row);
            }else if (caseNumber === 3) {
                returnedWord = this.returnARandomWordFromSuggestionsCaseThree(beginningOfTheWordOnAcrossString, row);
            }

            firstLettersWordsArray.push(returnedWord);
        }
        return firstLettersWordsArray;
    }

    public returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordAcross: string, row: number) {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {  // if the beginning of 2 words matches
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring(0, beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 9 && lexicon[i].length >= 3) { // At (0,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 4 && lexicon[i].length >= 3) { // At (1,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length === 3) {  // At (2,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }
                }
            }
        }

        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }

    public returnARandomWordFromSuggestionsCaseTwo(beginningOfTheWordAcross: string, row: number) {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) { // if the beginning of 2 words matches
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring(0, beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 5 && lexicon[i].length >= 3) { // At (3,3) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 3) {  // At (4,3) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length <= 5) {   // At (5,3) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 3) {
                        if (lexicon[i].length === 3) {   // At (6,3) ---->
                            theWords.push(lexicon[i]);
                        }
                    }
                }
            }
        }

        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }

    public returnARandomWordFromSuggestionsCaseThree(beginningOfTheWordAcross: string, row: number) {
        beginningOfTheWordAcross = this.reverseString(beginningOfTheWordAcross);
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) { // if the end of 2 words matches
            if (lexicon[i].substring((lexicon[i].length) - beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring((lexicon[i].length) - beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 3) {   // At (7,7) <----
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 4 && lexicon[i].length >= 3) {   // At (8,7) <----
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length <= 8 && lexicon[i].length >= 3) {   // At (9,7) <----
                            theWords.push(lexicon[i]);
                        }
                    }
                }
            }
        }

        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }

    

    public initialisation(caseNumber: number) {
        let word;
        if (caseNumber === 1) {
            word = this.getWordOfLengthThreeToSix();
        }else if (caseNumber === 2) {
            word = this.getWordOfLengthFour();
        }else if (caseNumber === 3) {
            word = this.getWordOfLengthThree();
        }
        this.temporaryGridForVertical.push(word);
        this.findSecondWord(word, caseNumber);
    }

    public findSecondWord(word: Word, caseNumber: number) {
        let firstWordsSuggestions: string[] = [];
        let counter = 25;
        while (counter !== 0) {
            if (caseNumber === 1) {
                word = this.getWordOfLengthFour();
            }else if (caseNumber === 2) {
                word = this.getWordOfLengthFour();
            }else if (caseNumber === 3) {
                word = this.getWordOfLengthThree();
            }
            this.temporaryGridForVertical.push(word);
            firstWordsSuggestions = this.returnArrayOfWordsThatFitsAcross(1, caseNumber);

            if (this.suggestionsContainsNothing(firstWordsSuggestions)) {
                this.temporaryGridForVertical.pop();
                counter--;
            }else {
                break;
            }
        }
        if (counter === 0) {
            this.temporaryGridForVertical.pop();
            this.initialisation(caseNumber);
        }else {
            this.findThirdWord(word, firstWordsSuggestions, caseNumber);
        }
    }

    public findThirdWord(word: Word, wordsSuggestions: string[], caseNumber: number) {
        wordsSuggestions = [];
        let counter = 25;
        while (counter !== 0) {
            if (caseNumber === 1) {
                word = this.getWordOfLengthThree();
            }else if (caseNumber === 2) {
                word = this.getWordOfLengthFour();
            }else if (caseNumber === 3) {
                word = this.getWordOfLengthThree();
            }
            this.temporaryGridForVertical.push(word);
            wordsSuggestions = this.returnArrayOfWordsThatFitsAcross(2, caseNumber);

            if (this.suggestionsContainsNothing(wordsSuggestions)) {
                this.temporaryGridForVertical.pop();
                counter--;
            } else {
                break;
            }
        }
        if (counter === 0) {
            this.temporaryGridForVertical.pop();
            this.findSecondWord(word, caseNumber);
        }else {
            this.pushOnTheTemporaryGridAcrossWordsSuggestions(wordsSuggestions);
        }
    }

    public suggestionsContainsNothing(arrayOfSuggestions: string[]) {
        for (let i = 0; i < arrayOfSuggestions.length; i++) {
            if (arrayOfSuggestions[i] === 'nothing found') {
                return true;
            }
        }
        return false;
    }

    // theses three functions are used to get a vertical word
    // for case one
    public getWordOfLengthThreeToSix() {
        return getWordOfDesiredLength(3, 6, this);
    }

    // for case one and three
    public getWordOfLengthThree() {
        return  getWordOfDesiredLength(3, 3, this);
    }

    // for case two
    public getWordOfLengthFour() {
        return getWordOfDesiredLength(4, 4, this);
    }

    public reverseString(str: string) {
        const splitString = str.split('');
        const reverseArray = splitString.reverse();
        return reverseArray.join('');
    }
    */
}

const puzzle = new Grid(10);
