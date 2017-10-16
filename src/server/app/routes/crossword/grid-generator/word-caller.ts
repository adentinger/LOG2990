import { lexicon } from './englishWords';
import { Word } from './word';
import { GridGenerator } from './grid-generator';
import * as http from 'http';

export class WordCaller {

    public getWordOfDesiredLength(lengthMin: number, lengthMax: number, gridGenerator: GridGenerator) {
        const desiredWords: string[] = [];
        for (let i = 0 ; i < lexicon.length; i++) {
            if ((lexicon[i].length >= lengthMin) && (lexicon[i].length <= lengthMax)) {
                desiredWords.push(lexicon[i]);
            }
        }

        let desiredWordVerified: string;
        let alreadyChosen = false;
        do {
            desiredWordVerified = this.getRandomWordFrom(desiredWords);
            alreadyChosen = this.alreadyChoosen(desiredWordVerified,
                                                gridGenerator.grid.gridForVertical,
                                                gridGenerator.grid.gridForAcross);

        } while (alreadyChosen === true);
        desiredWordVerified = this.wordFormatting(desiredWordVerified);
        return new Word(desiredWordVerified);
    }

    public getRandomWordFrom(words: string[]): string {
        const MIN = 0;
        const MAX = words.length - 1;
        const RANDOM_INDEX = (Math.floor(Math.random() * (MAX - MIN)) + MIN);
        return words[RANDOM_INDEX];
    }

    public formatGrid(crossword: GridGenerator) {
        for (let index = 0; index < crossword.gridDisplay.length; index++) {
            for (let j = 0; j < crossword.gridDisplay[index].length; j++) {
                if (!crossword.gridDisplay[index][j]) {
                    crossword.gridDisplay[index][j] = ' ';
                }
            }
        }
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
        word = word.replace(/['-]/g, '');
        return word;
    }

    public wordFormatting(word: string) {
        word = this.noAccent(word);
        word = this.noApostropheAndDash(word);
        return word;
    }

    public reverseString(str: string) {
        const splitString = str.split('');
        const reverseArray = splitString.reverse();
        return reverseArray.join('');
    }

    public alreadyChoosen(wordToCheck: string, gridForVertical: Word[], gridForAcross: Word[]) {
        let alreadyChoosen = false;
        const allWords: string[] = [];

            for (let i = 0; i < gridForAcross.length; i++) {
                allWords.push(gridForAcross[i].value);
            }

            for (let i = 0; i < gridForVertical.length; i++) {
                allWords.push(gridForVertical[i].value);
            }

            for (let i = 0; i < allWords.length; i++) {
                if (allWords[i] === wordToCheck) {
                    alreadyChoosen = true;
                }
            }

        return alreadyChoosen;
    }

    public getWords(minLength: number,
                    maxLength: number = 100, isCommon: boolean = true,
                    charConstraints: {char: string, position: number}[] = []): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const URL = 'http://localhost:3000/crossword/lexic/words?' +
                        'minLength='  + minLength +
                        '&maxLength=' + maxLength +
                        '&isCommon='  + isCommon  +
                        '&charConstraints=' + JSON.stringify(charConstraints);
            http.get(URL, (response: http.IncomingMessage) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {
                    resolve(JSON.parse(data));
                });
                response.on('error', reject);
            });
        });
    }

}
