import { readFileSync } from 'fs';
const lexicon = readFileSync('englishWords.txt', 'utf8').toString().split('\n');
for (let i = 0; i < lexicon.length; i++) {
    lexicon[i] = lexicon[i].slice(0, -1);
}

class Grid {
    public gridForAcross: string[] = [];
    public gridForVertical: string[] = [];
    public grid = new Array(10);

    constructor() {
        for (let i = 0; i < 10; i++) {
            this.grid[i] = new Array(10);
        }
    }

    public putWordVertical(word: string, column: number) {
        this.gridForVertical.push(word);

        let rowToWriteOn: number;
        if ((column >= 0) && (column <= 2)) {
            rowToWriteOn = 0;
        }else if ((column >= 3) && (column <= 6)) {
            rowToWriteOn = 3;
        }else if ((column >= 7) && (column <= 9)) {
            rowToWriteOn = 7;
        }

        for (let i = 0; i < word.length; i++) {
            if (word[i] !== '\r') {
                this.grid[rowToWriteOn + i][column] = this.gridForVertical[this.gridForVertical.length - 1][i];
            }
        }
        this.grid[word.length][column] = '0';
    }

    public putWordAcross(word: string, row: number) {
        this.gridForAcross.push(word);
        for (let i = 0; i < word.length; i++) {
            if (word[i] !== '\r') {
                this.grid[row][i] = this.gridForAcross[this.gridForAcross.length - 1][i];
            }
        }
        this.grid[row][word.length] = '0';
    }

    public returnArrayOfWordsThatFitsAcrossCaseOne(onColumnNow: number) {
        const threeWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];
        for (let row = 0; row < 3; row++) { // pour les trois premieres rangées
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.gridForVertical[column][row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');

            beginningOfTheWordOnAcross = [];

            const returnedWord = this.returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordOnAcrossString, row);

            threeWordsArray.push(returnedWord);
            console.log(beginningOfTheWordOnAcrossString + ' ' + returnedWord);
        }
        return threeWordsArray;
    }

    public returnARandomWordFromSuggestionsCaseOne(beginningOfTheWordAcross: string, row: number) {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring(0, beginningOfTheWordAcross.length).length)) > 0) {
                    if (row === 0) {
                        if (lexicon[i].length <= 10) {
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 1) {
                        if (lexicon[i].length <= 4) {
                            theWords.push(lexicon[i]);
                        }
                    }else if (row === 2) {
                        if (lexicon[i].length <= 3) {
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
}


function suggestionsContainsNothing(arrayOfSuggestions: string[]) {
    for (let i = 0; i < arrayOfSuggestions.length; i++) {
        if (arrayOfSuggestions[i] === 'nothing found') {
            return true;
        }
    }
    return false;
}


const puzzle = new Grid();


let word = getWordOfLengthThreeToSix();
puzzle.putWordVertical(word, 0);

let threeWordsSuggestions: string[] = [];
let completed = false;
while (!completed) {
    word = getWordOfLengthFour();
    puzzle.putWordVertical(word, 1);
    threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseOne(1);

    if (suggestionsContainsNothing(threeWordsSuggestions)) {
        puzzle.gridForVertical.pop();
    }else {
        completed = true;
    }
}


threeWordsSuggestions = [];
completed = false;
while (!completed) {
    word = getWordOfLengthThree();
    puzzle.putWordVertical(word, 2);
    threeWordsSuggestions = puzzle.returnArrayOfWordsThatFitsAcrossCaseOne(2);

    if (suggestionsContainsNothing(threeWordsSuggestions)) {
        puzzle.gridForVertical.pop();
    }else {
        completed = true;
    }
}

for (let i = 0; i < threeWordsSuggestions.length; i++) {
    puzzle.gridForAcross.push(threeWordsSuggestions[i]);
}

function formatGrid(crossword: Grid) {
    for (let index = 0; index < crossword.grid.length; index++) {
        for (let j = 0; j < crossword.grid[index].length; j++) {
            if (!crossword.grid[index][j]) {
                crossword.grid[index][j] = ' ';
            }
        }
    }
}

formatGrid(puzzle);
console.dir(puzzle);





/* function getWordComparaison(beginningOfWord:string[]){
    for (let i = 0; i < lexicon.length; i++) {
        for (let j = 0; j < beginningOfWord.length; j++) {
            if (lexicon[i][j] == beginningOfWord[j]){
                return true;
            }
        }
    }
} */

function getWordOfLengthThreeToSix() {
    return getWordOfDesiredLength(3, 6);
}

// pour le cas 1
/* function getWordOfLengthThreeToFour() {
    return getWordOfDesiredLength(3, 4);
} */

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

