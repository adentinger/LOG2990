import { Word } from './word';
import * as http from 'http';

export class WordCaller {

    private static readonly INSTANCE = new WordCaller();

    private constructor() {}

    public static getInstance(): WordCaller {
        return WordCaller.INSTANCE;
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
