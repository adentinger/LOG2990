import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { WordConstraintChecker } from './word-constraint-checker';
import { Word } from './word';

export abstract class GridFiller {

    protected static readonly NUM_TRIES = 20;

    protected acrossWords: WordPlacement[] = [];
    protected verticalWords: WordPlacement[] = [];
    protected suggestionsGetter: AbstractWordSuggestionsGetter;

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        this.suggestionsGetter = suggestionsGetter;
    }

    public get acrossPlacement(): WordPlacement[] {
        return this.acrossWords.slice();
    }

    public get verticalPlacement(): WordPlacement[] {
        return this.verticalWords.slice();
    }

    public async fill(grid: Grid): Promise<void> {
        let doneAcross = false;
        while (!doneAcross) {
            doneAcross = await this.placeAcrossWords(grid);
        }
        let doneVertical = false;
        while (!doneVertical) {
            doneVertical = await this.placeVerticalWords(grid);
        }
    }

    private async placeAcrossWords(grid: Grid, current: number = 0): Promise<boolean> {
        // We assume that the words in acrossWords and verticalWords
        // are given top to bottom and left to right (respectively).
        if (current < this.acrossWords.length) {
            const WORD_PLACEMENT = this.acrossWords[current];
            const SUGGESTIONS =
                await this.suggestionsGetter.getSuggestions(
                    WORD_PLACEMENT.minLength,
                    WORD_PLACEMENT.maxLength,
                    [],
                    WORD_PLACEMENT.position
                );

            let done = false;
            let numTriesLeft = GridFiller.NUM_TRIES;
            while (numTriesLeft > 0 && SUGGESTIONS.length > 0 && !done) {
                done = await this.trySuggestion(
                    grid,
                    SUGGESTIONS.consumeRandomSuggestion(),
                    current
                );
                --numTriesLeft;
            }
            return done;
        }
        else {
            return true;
        }
    }

    private async placeVerticalWords(grid: Grid, current: number = 0): Promise<boolean> {
        for (let i = 0; i < this.verticalWords.length; ++i) {
            const PLACEMENT = this.verticalWords[i];
            const CONSTRAINT =
            WordConstraintChecker.getInstance().getVerticalWordConstraint(
                grid,
                PLACEMENT.position,
                PLACEMENT.minLength
            );
            const SUGGESTIONS = await this.suggestionsGetter.getSuggestions(
                PLACEMENT.minLength,
                PLACEMENT.maxLength,
                CONSTRAINT,
                PLACEMENT.position
            );
            // We know that there is at least one suggestion
            const WORD = new Word(
                SUGGESTIONS.consumeRandomSuggestion(),
                PLACEMENT.position
            );
            grid.vertical.push(WORD);
        }
        return true;
    }

    private async areConstraintsMetFor(grid: Grid): Promise<boolean> {
        for (let i = 0; i < this.verticalWords.length; ++i) {
            const VERTICAL_WORD = this.verticalWords[i];
            const VERTICAL_WORD_CONSTRAINT =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    VERTICAL_WORD.position,
                    VERTICAL_WORD.minLength
                );
            const SUGGESTIONS_EXIST =
                await this.suggestionsGetter.doSuggestionsExist(
                    VERTICAL_WORD.minLength,
                    VERTICAL_WORD.maxLength,
                    VERTICAL_WORD_CONSTRAINT,
                    VERTICAL_WORD.position
                );
            if (!SUGGESTIONS_EXIST) {
                return false;
            }
        }
        return true;
    }

    private async trySuggestion(grid: Grid, suggestion: string, current: number): Promise<boolean> {
        const WORD_PLACEMENT = this.acrossPlacement[current];
        const WORD = new Word(
            suggestion,
            WORD_PLACEMENT.position
        );
        grid.across.push(WORD);
        try {
            if (await this.areConstraintsMetFor(grid)) {
                if (await this.placeAcrossWords(grid, current + 1)) {
                    return true;
                }
                else {
                    grid.across.pop();
                    return false;
                }
            }
            else {
                grid.across.pop();
                return false;
            }
        }
        catch (e) {
            grid.across.pop();
            return false;
        }
    }

}

