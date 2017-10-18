export class WordSuggestions {

    private suggestions: string[];

    constructor(suggestions: string[]) {
        this.suggestions = suggestions;
    }

    public get length(): number {
        return this.suggestions.length;
    }


    public get randomSuggestion(): string {
        if (this.length >= 0) {
            const MIN = 0;
            const MAX = this.suggestions.length;
            let randomIndex = this.suggestions.length;
            while (randomIndex >= this.suggestions.length) {
                randomIndex = (Math.floor(Math.random() * (MAX - MIN)) + MIN);
            }
            return this.suggestions[randomIndex];
        }
        else {
            throw new Error('Cannot get random suggestion: no suggestions');
        }
    }

}
