import { readFileSync } from 'fs';
const lexicon = readFileSync('englishWords.txt', 'utf8').toString().split('\n');
for (let i = 0; i < lexicon.length; i++) {
    lexicon[i] = lexicon[i].slice(0, -1);
}

class Grid {
    public temporaryGridForAcross: string[] = [];
    public temporaryGridForVertical: string[] = [];
    public gridForAcross: string[] = [];
    public gridForVertical: string[] = [];
    public grid = new Array(10);

    constructor() {
        for (let i = 0; i < 10; i++) {
            this.grid[i] = new Array(10);
        }
    }

    public putWordVertical(word: string, column: number) {

        let rowToWriteOn: number;
        if ((column >= 0) && (column <= 2)) {
            rowToWriteOn = 0;
        } else if ((column >= 3) && (column <= 5)) {
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

    public returnArrayOfWordsThatFitsAcrossCaseOne(onColumnNow: number) { // on veu mettre un mot la, prend la colonne
                                                                    // où on est placé en parametre
        const firstLettersWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];
        for (let row = 0; row < 3; row++) { // pour les trois premieres rangées
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column][row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];

            const returnedWord = this.returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordOnAcrossString, row);

            firstLettersWordsArray.push(returnedWord);

            console.log(beginningOfTheWordOnAcrossString + ' ' + returnedWord);
        }
        return firstLettersWordsArray;
    }

    public returnArrayOfWordsThatFitsAcrossCaseTwo(onColumnNow: number) {

        const firstLettersWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];
        for (let row = 0; row < 4; row++) { // pour les quatre premieres rangées
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column][row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];

            const returnedWord = this.returnARandomWordFromSuggestionsCaseTwo(beginningOfTheWordOnAcrossString, row);

            firstLettersWordsArray.push(returnedWord);

            console.log(beginningOfTheWordOnAcrossString + ' ' + returnedWord);
        }
        return firstLettersWordsArray;
    }

    public returnArrayOfWordsThatFitsAcrossCaseThree(onColumnNow: number) {

        const firstLettersWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];
        for (let row = 0; row < 3; row++) { // pour les trois premieres rangées
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column][row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];

            const returnedWord = this.returnARandomWordFromSuggestionsCaseThree(beginningOfTheWordOnAcrossString, row);

            firstLettersWordsArray.push(returnedWord);

            console.log(beginningOfTheWordOnAcrossString + '  ' + returnedWord);
        }
        return firstLettersWordsArray;
    }


    public returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordAcross: string, row: number) {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring(0, beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 9 && lexicon[i].length >= 3) {
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 4 && lexicon[i].length >= 3) {  // coordonnée (1,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length === 3) {   // coordonnée (2,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }
                }
            }
        }

        // retourne un mot random parmi ceux trouvés
        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }

    public returnARandomWordFromSuggestionsCaseTwo(beginningOfTheWordAcross: string, row: number) {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring(0, beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 5 && lexicon[i].length >= 3) {
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 3) {
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length <= 5) {   // coordonnée (5,3) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 3) {
                        if (lexicon[i].length === 3) {   // coordonnée (6,3) ---->
                            theWords.push(lexicon[i]);
                        }
                    }
                }
            }
        }

        // retourne un mot random parmi ceux trouvés
        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }

    public returnARandomWordFromSuggestionsCaseThree(beginningOfTheWordAcross: string, row: number) {
        beginningOfTheWordAcross = reverseString(beginningOfTheWordAcross);
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) { // if end of 2 words matches
            if (lexicon[i].substring((lexicon[i].length) - beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring((lexicon[i].length) - beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 3) { // ici on parle du mot quon veut placer en horizontal (7,7) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 4 && lexicon[i].length >= 3) {   // coordonnée (8,7) <----
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length <= 8 && lexicon[i].length >= 3) {   // coordonnée (9,7) <----
                            theWords.push(lexicon[i]);
                        }
                    }
                }
            }
        }

        // retourne un mot random parmi ceux trouvés
        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }
}

function suggestionsContainsNothing(arrayOfSuggestions: string[]) {
    for (let i = 0; i < arrayOfSuggestions.length; i++) {
        if (arrayOfSuggestions[i] === 'nothing found') {
            return true;
        }
    }
    return false;
}

// create a puzzle
const puzzle = new Grid();
let threeWordsSuggestionsOut: string[] = [];

function initialisation() {
    const word = getWordOfLengthThreeToSix();
    puzzle.temporaryGridForVertical.push(word);
    findSecondWord(word);
}

function initialisationCaseTwo() {
    const word = getWordOfLengthFour();
    puzzle.temporaryGridForVertical.push(word);
    findSecondWordCaseTwo(word);
}

function initialisationCaseThree() {
    const word = getWordOfLengthThree();
    puzzle.temporaryGridForVertical.push(word);
    findSecondWordCaseThree(word);
}

function findSecondWord(word: string) {
    let threeWordsSuggestions: string[] = [];
    let counter = 25;
    while (counter !== 0) {
        word = getWordOfLengthFour();
        puzzle.temporaryGridForVertical.push(word);
        threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseOne(1);

        if (suggestionsContainsNothing(threeWordsSuggestions)) {
            puzzle.temporaryGridForVertical.pop();
            counter--;
        }else {
            break;
        }
    }
    if (counter === 0) {
        puzzle.temporaryGridForVertical.pop();
        initialisation();
    }else {
        findThirdWord(word, threeWordsSuggestions);
    }
}

function findSecondWordCaseTwo(word: string) {
    let threeWordsSuggestions: string[] = [];
    let counter = 25;
    while (counter !== 0) {
        word = getWordOfLengthFour();
        puzzle.temporaryGridForVertical.push(word);
        threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseTwo(1);

        if (suggestionsContainsNothing(threeWordsSuggestions)) {
            puzzle.temporaryGridForVertical.pop();
            counter--;
        }else {
            break;
        }
    }
    if (counter === 0) {
        puzzle.temporaryGridForVertical.pop();
        initialisationCaseTwo();
    }else {
        findThirdWordCaseTwo(word, threeWordsSuggestions);
    }
}

function findSecondWordCaseThree(word: string) {
    let threeWordsSuggestions: string[] = [];
    let counter = 25;
    while (counter !== 0) {
        word = getWordOfLengthThree();
        puzzle.temporaryGridForVertical.push(word);
        threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseThree(1);

        if (suggestionsContainsNothing(threeWordsSuggestions)) {
            puzzle.temporaryGridForVertical.pop();
            counter--;
        } else {
            break;
        }
    }
    if (counter === 0) {
        puzzle.temporaryGridForVertical.pop();
        initialisationCaseThree();
    }else {
        findThirdWordCaseThree(word, threeWordsSuggestions);
    }
}

function findThirdWord(word: string, threeWordsSuggestions: string[]) {
    threeWordsSuggestions = [];
    let counter = 25;
    while (counter !== 0) {
        word = getWordOfLengthThree();
        puzzle.temporaryGridForVertical.push(word);
        threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseOne(2);

        if (suggestionsContainsNothing(threeWordsSuggestions)) {
            puzzle.temporaryGridForVertical.pop();
            counter--;
        }else {
            break;
        }
    }
    if (counter === 0) {
        puzzle.temporaryGridForVertical.pop();
        findSecondWord(word);
    }else {
        threeWordsSuggestionsOut = threeWordsSuggestions;
    }
}

function findThirdWordCaseTwo(word: string, threeWordsSuggestions: string[]) {
    threeWordsSuggestions = [];
    let counter = 25;
    while (counter !== 0) {
        word = getWordOfLengthFour();
        puzzle.temporaryGridForVertical.push(word);
        threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseTwo(2);

        if (suggestionsContainsNothing(threeWordsSuggestions)) {
            puzzle.temporaryGridForVertical.pop();
            counter--;
        } else {
            break;
        }
    }
    if (counter === 0) {
        puzzle.temporaryGridForVertical.pop();
        findSecondWordCaseTwo(word);
    }else {
        threeWordsSuggestionsOut = threeWordsSuggestions;
    }
}

function findThirdWordCaseThree(word: string, threeWordsSuggestions: string[]) {
    threeWordsSuggestions = [];
    let counter = 25;
    while (counter !== 0) {
        word = getWordOfLengthThree();
        puzzle.temporaryGridForVertical.push(word);
        threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseThree(2);

        if (suggestionsContainsNothing(threeWordsSuggestions)) {
            puzzle.temporaryGridForVertical.pop();
            counter--;
        } else {
            break;
        }
    }
    if (counter === 0) {
        puzzle.temporaryGridForVertical.pop();
        findSecondWordCaseThree(word);
    }else {
        threeWordsSuggestionsOut = threeWordsSuggestions;
    }
}

// les fonctions suivantes c'est pour trouver les mots en vertical

// pour le cas 1
function getWordOfLengthThreeToSix() {
    return getWordOfDesiredLength(3, 6);
}


// pour le cas 1 et 3
function getWordOfLengthThree() {
    return getWordOfDesiredLength(3, 3);
}

// pour le cas 2
function getWordOfLengthFour() {
    return getWordOfDesiredLength(4, 4);
}

function getWordOfDesiredLength(lengthMin: number, lengthMax: number) {
    const desiredWords: string[] = [];
    for (let i = 0 ; i < lexicon.length; i++) {
        if ((lexicon[i].length >= lengthMin) && (lexicon[i].length <= lengthMax)) {
            desiredWords.push(lexicon[i]);
        }
    }

    return desiredWords[getRandomIndex(0, desiredWords.length - 1)];
}

function getRandomIndex(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min)) + min);
}

function formatGrid(crossword: Grid) {
    for (let index = 0; index < puzzle.grid.length; index++) {
        for (let j = 0; j < puzzle.grid[index].length; j++) {
            if (!puzzle.grid[index][j]) {
                puzzle.grid[index][j] = ' ';
            }
        }
    }
}

function reverseString(str: string) {
    const splitString = str.split('');
    const reverseArray = splitString.reverse();
    return reverseArray.join('');
}

initialisation();
for (let i = 0; i < threeWordsSuggestionsOut.length; i++) {
    puzzle.temporaryGridForAcross.push(threeWordsSuggestionsOut[i]);
}
puzzle.pushOnTheGridAndReinitialiseTemporaryGrid();


threeWordsSuggestionsOut = [];
initialisationCaseTwo();
for (let i = 0; i < threeWordsSuggestionsOut.length; i++) {
    puzzle.temporaryGridForAcross.push(threeWordsSuggestionsOut[i]);
}
puzzle.pushOnTheGridAndReinitialiseTemporaryGrid();


threeWordsSuggestionsOut = [];
initialisationCaseThree();
for (let i = 0; i < threeWordsSuggestionsOut.length; i++) {
    puzzle.temporaryGridForAcross.push(threeWordsSuggestionsOut[i]);
}
puzzle.pushOnTheGridAndReinitialiseTemporaryGrid();

// finaly we push a word on last column
puzzle.gridForVertical.push((getWordOfDesiredLength(4, 5)));

console.dir(puzzle.gridForVertical);
console.dir(puzzle.gridForAcross);

for (let i = 0; i < puzzle.gridForVertical.length; i++) {
    puzzle.putWordVertical(puzzle.gridForVertical[i], i);
}

for (let i = 0; i < puzzle.gridForAcross.length; i++) {
    puzzle.putWordAcross(puzzle.gridForAcross[i], i);
}

formatGrid(puzzle);
console.dir(puzzle.grid);
