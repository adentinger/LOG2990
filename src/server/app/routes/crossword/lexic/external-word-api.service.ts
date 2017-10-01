export class ExternalWordApiService {
    public getDefinitions(word: string): Promise<string[]> {
        throw new Error('not implemented');
    }

    public getFrequency(word: string): Promise<number> {
        throw new Error('not implemented');
    }

}
