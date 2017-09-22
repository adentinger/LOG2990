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

import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';

@MiddleWare
export class GridGeneratorMiddleWare {
    @Route('get', '/crossword/grid')
    public pending(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send(new Grid(10));
    }
}

for (let i = 0; i < lexicon.length; i++) {
    lexicon[i] = lexicon[i].slice(0, -1);
}

export class Word {
    public value: string;
    public position: [number, number];
    constructor(value: string) {
        this.value = value;
    }
}

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
        this.initialisation(1);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        this.initialisation(2);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        this.initialisation(3);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        // finaly we push a word on last column
        this.gridForVertical.push((this.getWordOfDesiredLength(4, 5)));

        this.generateGridTenByTenContainingWordStartingPosition()
        //console.info(this.gridForPosition);
        this.putWordAcrossAndVerticalOnGridForPrintingOut();
        // prints out
        //console.dir(this.gridForVertical);
        //console.dir(this.gridForAcross);
        this.formatGrid(this);
        //console.dir(this.grid);
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

        returnedWord = theWords[this.getRandomIndex(0, theWords.length - 1)];

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

        returnedWord = theWords[this.getRandomIndex(0, theWords.length - 1)];

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

        returnedWord = theWords[this.getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }

    public getWordOfDesiredLength(lengthMin: number, lengthMax: number) {
        const desiredWords: string[] = [];
        for (let i = 0 ; i < lexicon.length; i++) {
            if ((lexicon[i].length >= lengthMin) && (lexicon[i].length <= lengthMax)) {
                desiredWords.push(lexicon[i]);
            }
        }

        let desiredWordVerified: string;
        let alreadyChosen = false;
        do {
            desiredWordVerified = desiredWords[this.getRandomIndex(0, desiredWords.length - 1)];
            alreadyChosen = this.alreadyChoosen(desiredWordVerified);

        }while (alreadyChosen === true);
        desiredWordVerified = this.wordFormatting(desiredWordVerified);
        return new Word(desiredWordVerified);


    }

    public putWordAcrossAndVerticalOnGridForPrintingOut() {
        for (let i = 0; i < this.gridForVertical.length; i++) {
            this.putWordVertical(this.gridForVertical[i], i);
        }

        for (let i = 0; i < this.gridForAcross.length; i++) {
            this.putWordAcross(this.gridForAcross[i], i);
        }
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
        return this.getWordOfDesiredLength(3, 6);
    }

    // for case one and three
    public getWordOfLengthThree() {
        return  this.getWordOfDesiredLength(3, 3);
    }

    // for case two
    public getWordOfLengthFour() {
        return this.getWordOfDesiredLength(4, 4);
    }


    public getRandomIndex(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return (Math.floor(Math.random() * (max - min)) + min);
    }

    public formatGrid(crossword: Grid) {
        for (let index = 0; index < crossword.grid.length; index++) {
            for (let j = 0; j < crossword.grid[index].length; j++) {
                if (!crossword.grid[index][j]) {
                    crossword.grid[index][j] = ' ';
                }
            }
        }
    }

    public reverseString(str: string) {
        const splitString = str.split('');
        const reverseArray = splitString.reverse();
        return reverseArray.join('');
    }

    public noAccent(word: string) {
        const accent = [
            /[\300-\306]/g, /[\340-\346]/g, // A, a
            /[\310-\313]/g, /[\350-\353]/g, // E, e
            /[\314-\317]/g, /[\354-\357]/g, // I, i
            /[\322-\330]/g, /[\362-\370]/g, // O, o
            /[\331-\334]/g, /[\371-\374]/g, // U, u
            /[\321]/g, /[\361]/g, // N, n
            /[\307]/g, /[\347]/g, // C, c
        ];
        const noAccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

        for (let i = 0; i < accent.length; i++) {
            word = word.replace(accent[i], noAccent[i]);
        }

        return word;
    }

    public noApostropheAndDash(word: string) {
        word = word.replace(/-/g, '');
        word = word.replace(/'/g, '');
        return word;
    }

    public wordFormatting(word: string) {
        word = this.noAccent(word);
        word = this.noApostropheAndDash(word);
        return word;
    }

    public generateGridTenByTenContainingWordStartingPosition() {
        // tuple --> [across word number, vertical word number]
        this.gridForPosition[0][0] = [1, 1];
        this.gridForPosition[0][1] = [0, 2];
        this.gridForPosition[0][2] = [0, 3];
        this.gridForPosition[3][3] = [4, 4];
        this.gridForPosition[3][4] = [0, 5];
        this.gridForPosition[3][5] = [0, 6];
        this.gridForPosition[7][6] = [8, 7];
        this.gridForPosition[7][7] = [0, 8];
        this.gridForPosition[7][8] = [0, 9];
        this.gridForPosition[2][9] = [0, 10];
        this.gridForPosition[1][0] = [2, 0];
        this.gridForPosition[2][0] = [3, 0];
        this.gridForPosition[4][3] = [5, 0];
        this.gridForPosition[5][3] = [6, 0];
        this.gridForPosition[6][3] = [7, 0];
        this.gridForPosition[8][8] = [9 , 0]; // end of the word
        this.gridForPosition[9][8] = [10, 1]; // end of the word

        // other cases are black
        for (let i = 0; i < this.gridForPosition.length; i++) {
            for (let j = 0; j < this.gridForPosition[i].length; j++) {
                if (!this.gridForPosition[i][j]) {
                    this.gridForPosition[i][j] = [0, 0];
                }
            }
        }
    }
}

const puzzle = new Grid(10);
