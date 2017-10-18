import * as http from 'http';

// This class gets words from the Lexical microservice.

export class LexiconCaller {

    private static readonly INSTANCE = new LexiconCaller();

    private constructor() {}

    public static getInstance(): LexiconCaller {
        return LexiconCaller.INSTANCE;
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
