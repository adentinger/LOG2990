import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { WordConstraintChecker } from './word-constraint-checker';
import { Word } from './word';

export abstract class GridFiller {

    protected static readonly NUM_TRIES = 100;

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
        await this.placeAcrossWords(grid);
        await this.placeVerticalWords(grid);
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

            if (SUGGESTIONS.length > 0) {
                let done = false;
                let numTriesLeft =
                    (SUGGESTIONS.length !== 1) ?
                    GridFiller.NUM_TRIES :
                    SUGGESTIONS.length;
                while (numTriesLeft > 0 && !done) {
                    const WORD = new Word(
                        SUGGESTIONS.randomSuggestion,
                        WORD_PLACEMENT.position
                    );
                    grid.across.push(WORD);
                    if (await this.areConstraintsMetFor(grid) &&
                        await this.placeAcrossWords(grid, current + 1)) {
                        done = true;
                    }
                    else {
                        grid.across.pop();
                    }
                    --numTriesLeft;
                }
                return done;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }

    private async placeVerticalWords(grid: Grid, current: number = 0): Promise<boolean> {
        // TODO
        return false;
    }

    private async areConstraintsMetFor(grid: Grid): Promise<boolean> {
        for (let i = 0; i < this.verticalWords.length; ++i) {
            const VERTICAL_WORD = this.verticalWords[i];
            const VERTICAL_WORD_CONSTRAINT =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    VERTICAL_WORD.position
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

}

