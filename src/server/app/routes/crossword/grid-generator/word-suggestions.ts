export class WordSuggestions {

    private suggestions: string[];

    constructor(suggestions: string[]) {
        this.suggestions = suggestions;
    }

    public get length(): number {
        return this.suggestions.length;
    }


    public get randomSuggestion(): string {
        return null;
    }

}
