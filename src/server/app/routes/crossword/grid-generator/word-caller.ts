import * as http from 'http';

export class WordCaller {

    private static readonly INSTANCE = new WordCaller();

    private constructor() {}

    public static getInstance(): WordCaller {
        return WordCaller.INSTANCE;
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
