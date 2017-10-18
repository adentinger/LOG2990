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
            return null;
        }
        else {
            throw new Error('Cannot get random suggestion: no suggestions');
        }
    }

}
