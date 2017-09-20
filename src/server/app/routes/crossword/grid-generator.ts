/*
Crossword minimal black cases X.
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
*/

import { readFileSync } from 'fs';
export const lexicon = readFileSync('englishWords.txt', 'utf8').toString().split('\n');
for (let i = 0; i < lexicon.length; i++) {
    lexicon[i] = lexicon[i].slice(0, -1);
}

export class Grid {
    public temporaryGridForAcross: string[] = [];
    public temporaryGridForVertical: string[] = [];
    public gridForAcross: string[] = [];
    public gridForVertical: string[] = [];
    public grid = new Array(10);

    constructor() {
        for (let i = 0; i < 10; i++) {
            this.grid[i] = new Array(10);
        }
        this.gridGeneration();
    }

    public putWordVertical(word: string, column: number) {

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

        for (let i = 0; i < word.length; i++) {
            this.grid[rowToWriteOn + i][column] = word[i];
        }
    }

    public putWordAcross(word: string, row: number) {

        let columnToWriteOn: number;
        if ((row >= 0) && (row <= 2)) {
            columnToWriteOn = 0;
        }else if ((row >= 3) && (row <= 6)) {
            columnToWriteOn = 3;
        }else if ((row >= 7) && (row <= 9)) {
            columnToWriteOn = 8;
        }

        if (row < 7) {
            for (let i = 0; i < word.length; i++) {
                this.grid[row][columnToWriteOn + i] = word[i];
            }
        }else {
            let wordIndex = word.length - 1;
            for (let i = 0; i < word.length; i++) {
                this.grid[row][columnToWriteOn - i] = word[wordIndex];
                wordIndex--;
            }
        }
    }

    public pushOnTheGridAndReinitialiseTemporaryGrid() {
        if (this.gridForVertical.length === 6) { // when on case 3
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
            this.temporaryGridForAcross.push(wordsSuggestions[i]);
        }
    }

    public alreadyChoosen(wordToCheck: string) {
        let alreadyChoosen = false;

        for (let i = 0; i < this.gridForAcross.length; i++) {
            if (this.gridForVertical[i] === wordToCheck) {
                alreadyChoosen = true;
            }
        }
        for (let i = 0; i < this.gridForVertical.length; i++) {
            if (this.gridForVertical[i] === wordToCheck) {
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
        }
        else if (caseNumber === 2) {
            untilWhichRow = 4;
        }
        else if (caseNumber === 3) {
            untilWhichRow = 3;
        }

        for (let row = 0; row < untilWhichRow; row++) { // for the first rows of the grid
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column][row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];
            let returnedWord;
            if (caseNumber === 1) {
                returnedWord = this.returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordOnAcrossString, row);
            }
            else if (caseNumber === 2) {
                returnedWord = this.returnARandomWordFromSuggestionsCaseTwo(beginningOfTheWordOnAcrossString, row);
            }
            else if (caseNumber === 3) {
                returnedWord = this.returnARandomWordFromSuggestionsCaseThree(beginningOfTheWordOnAcrossString, row);
            }

            firstLettersWordsArray.push(returnedWord);

            console.log(beginningOfTheWordOnAcrossString + ' ' + returnedWord);
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

        // retourne un mot random parmi ceux trouvés
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

        // retourne un mot random parmi ceux trouvés
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

        // retourne un mot random parmi ceux trouvés
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
            alreadyChosen = this.wordVerification(desiredWordVerified, this);

        }while (alreadyChosen === true);
        desiredWordVerified =  this.wordFormatting(desiredWordVerified);
        return desiredWords[this.getRandomIndex(0, desiredWords.length - 1)];

        // à remplacé par envoie et reception de requête du service lexicale
    }

    public putWordAcrossAndVerticalOnGridForPrintingOut() {
        for (let i = 0; i < this.gridForVertical.length; i++) {
            this.putWordVertical(this.gridForVertical[i], i);
        }
        
        for (let i = 0; i < this.gridForAcross.length; i++) {
            this.putWordAcross(this.gridForAcross[i], i);
        }
    }

    public gridGeneration() {
        // the grid is separate in three (3 cases) + a final
        this.initialisation(1);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        this.initialisation(2);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        this.initialisation(3);
        this.pushOnTheGridAndReinitialiseTemporaryGrid();
        // finaly we push a word on last column
        this.gridForVertical.push((this.getWordOfDesiredLength(4, 5)));
    
        /////////////////////////////////////////////////////////////////////////////
        this.putWordAcrossAndVerticalOnGridForPrintingOut();
        // prints out
        console.dir(this.gridForVertical);
        console.dir(this.gridForAcross);
        this.formatGrid(this);
        console.dir(this.grid);
        /////////////////////////////////////////////////////////////////////////////
    }

    public initialisation(caseNumber: number) {
        let word;
        if (caseNumber === 1) {
            word = this.getWordOfLengthThreeToSix();        
        }
        else if (caseNumber === 2) {
            word = this.getWordOfLengthFour();
        }
        else if (caseNumber === 3) {
            word = this.getWordOfLengthThree();
        }
        this.temporaryGridForVertical.push(word);    
        this.findSecondWord(word, caseNumber);
    }
    
    public findSecondWord(word: string, caseNumber: number) {
        let firstWordsSuggestions: string[] = [];
        let counter = 25;
        while (counter !== 0) {
            if (caseNumber === 1) {
                word = this.getWordOfLengthFour();
            }
            else if (caseNumber === 2) {
                word = this.getWordOfLengthFour();
            }
            else if (caseNumber === 3) {
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
    
    public findThirdWord(word: string, wordsSuggestions: string[], caseNumber: number) {
        wordsSuggestions = [];
        let counter = 25;
        while (counter !== 0) {
            if (caseNumber === 1) {
                word = this.getWordOfLengthThree();
            }
            else if (caseNumber === 2) {
                word = this.getWordOfLengthFour();
            }
            else if (caseNumber === 3) {
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
    
    
    // les fonctions suivantes c'est pour trouver les mots en vertical
    
    // pour le cas 1
    public getWordOfLengthThreeToSix() {
        return this.getWordOfDesiredLength(3, 6);
    }
    
    // pour le cas 1 et 3
    public getWordOfLengthThree() {
        return  this.getWordOfDesiredLength(3, 3);
    }
    
    // pour le cas 2
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
    
    public wordVerification(word: string, crossword: Grid) {
        if (crossword.gridForVertical.indexOf(word) > -1 && crossword.gridForAcross.indexOf(word) > -1) {
            return true;
        }else if (crossword.gridForVertical.indexOf(word) === -1 && crossword.gridForAcross.indexOf(word) === -1) {
            return false;
        }
    }
}

let puzzle = new Grid();