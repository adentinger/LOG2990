import * as http from 'http';
import * as readline from 'readline';

// http://api.wordnik.com:80/v4/word.json/the/frequency?useCanonical=false&startYear=1800&endYear=2017&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
export class ExternalWordApiService {
    private static readonly API_KEY = '509a8efe219607991700e030dbd01768e4a6b86cfa513bcc9';
    private static readonly REQUEST_BASE: http.RequestOptions = {
        hostname: 'api.wordnik.com',
        port: '80',
        protocol: 'http:',
        method: 'GET',
        agent: false
    };

    public getDefinitions(word: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const REQUEST_OPTIONS: http.RequestOptions = {
                ...ExternalWordApiService.REQUEST_BASE,
                path: `/v4/word.json/${word}/definitions` +
                '?limit=200&includeRelated=true&useCanonical=false&includeTags=false' +
                `&api_key=${ExternalWordApiService.API_KEY}`
            };
            const req = http.request(REQUEST_OPTIONS);
            req.on('response', (res: http.IncomingMessage) => {
                let resp = '';
                res.on('data', (chunck: string) => resp += chunck);
                res.on('end', () => {
                    try {
                        const DEFINITIONS = JSON.parse(resp);
                        resolve((DEFINITIONS as Array<any>)
                            .sort((a, b) => +a.sequence - +b.sequence)
                            .map((element) => <string>element.text));
                    } catch (error) {
                        reject(error);
                    }
                }).on('error', reject);
            }).on('error', reject);
            req.end(); // Ends the request setup and sends it.
        });
    }

    public getFrequency(word: string): Promise<number> {
        throw new Error('not implemented');
    }
}
