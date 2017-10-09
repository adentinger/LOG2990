import { lexicon } from './englishWords';
import { Word } from './word';
import { Grid } from './grid-generator';
for (let i = 0; i < lexicon.length; i++) {
    lexicon[i] = lexicon[i].slice(0, -1);
}

export function getWordOfDesiredLength(lengthMin: number, lengthMax: number, grid:Grid) {
    const desiredWords: string[] = [];
    for (let i = 0 ; i < lexicon.length; i++) {
        if ((lexicon[i].length >= lengthMin) && (lexicon[i].length <= lengthMax)) {
            desiredWords.push(lexicon[i]);
        }
    }

    let desiredWordVerified: string;
    let alreadyChosen = false;
    do {
        desiredWordVerified = desiredWords[getRandomIndex(0, desiredWords.length - 1)];
        alreadyChosen = grid.alreadyChoosen(desiredWordVerified);

    }while (alreadyChosen === true);
    desiredWordVerified = wordFormatting(desiredWordVerified);
    return new Word(desiredWordVerified);


}

export function getRandomIndex(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min)) + min);
}

export function formatGrid(crossword: Grid) {
    for (let index = 0; index < crossword.grid.length; index++) {
        for (let j = 0; j < crossword.grid[index].length; j++) {
            if (!crossword.grid[index][j]) {
                crossword.grid[index][j] = ' ';
            }
        }
    }
}

export function noAccent(word: string) {
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

export function noApostropheAndDash(word: string) {
    word = word.replace(/-/g, '');
    word = word.replace(/'/g, '');
    return word;
}

export function wordFormatting(word: string) {
    word = noAccent(word);
    word = noApostropheAndDash(word);
    return word;
}

export function reverseString(str: string) {
    const splitString = str.split('');
    const reverseArray = splitString.reverse();
    return reverseArray.join('');
}
