import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { WordSuggestionsGetter } from './word-suggestions-getter';
import { WordConstraintChecker } from './word-constraint-checker';
import { Word } from '../word';
import { WordSuggestions } from './word-suggestions';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { Player } from '../player';

export abstract class GridFiller {

    protected static readonly NUM_TRIES = 20;

    protected acrossWords: WordPlacement[] = [];
    protected verticalWords: WordPlacement[] = [];
    protected suggestionsGetter: WordSuggestionsGetter;

    private shouldCancelFilling = false;

    constructor(suggestionsGetter: WordSuggestionsGetter) {
        this.suggestionsGetter = suggestionsGetter;
    }

    public get acrossPlacement(): WordPlacement[] {
        return this.acrossWords.slice();
    }

    public get verticalPlacement(): WordPlacement[] {
        return this.verticalWords.slice();
    }

    public cancelFilling(): void {
        this.shouldCancelFilling = true;
    }

    public async fill(grid: Grid): Promise<void> {
        const INITIAL_NUMBER_OF_WORDS = grid.words.length;
        let done = false;
        while (!done) {
            while (grid.words.length > INITIAL_NUMBER_OF_WORDS) {
                grid.words.pop();
            }
            let doneAcross = false;
            while (!doneAcross) {
                doneAcross = await this.placeAcrossWords(grid);
            }
            let doneVertical = false;
            doneVertical = await this.placeVerticalWords(grid);
            done = doneVertical;
        }
    }

    private async placeAcrossWords(grid: Grid, current: number = 0): Promise<boolean> {
        // We assume that the words in acrossWords and verticalWords
        // are given top to bottom and left to right (respectively).
        if (current < this.acrossWords.length) {

            if (this.shouldCancelFilling) {
                throw new Error('Grid generation cancelled.');
            }

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
                const SUGGESTION = this.getAWordThatIsNotADuplicate(grid, SUGGESTIONS);
                if (SUGGESTION !== '') {
                    done = await this.trySuggestion(
                        grid,
                        SUGGESTION,
                        current
                    );
                }
                --numTriesLeft;
            }
            return done;
        }
        else {
            return true;
        }
    }

    private async placeVerticalWords(grid: Grid): Promise<boolean> {
        for (let i = 0; i < this.verticalWords.length; ++i) {
            const PLACEMENT = this.verticalWords[i];
            const CONSTRAINT =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    PLACEMENT
                );
            const SUGGESTIONS = await this.suggestionsGetter.getSuggestions(
                PLACEMENT.minLength,
                PLACEMENT.maxLength,
                CONSTRAINT,
                PLACEMENT.position
            );
            // We know that there is at least one suggestion
            const SUGGESTION = this.getAWordThatIsNotADuplicate(grid, SUGGESTIONS);
            if (SUGGESTION !== '') {
                const WORD = new Word(
                    SUGGESTION,
                    PLACEMENT.position,
                    Direction.vertical,
                    Player.NO_PLAYER
                );
                grid.words.push(WORD);
            }
            else {
                // Failure ; clean added vertical words
                for (let j = 0; j < i; ++j) {
                    grid.words.pop();
                }
                return false;
            }
        }
        return true;
    }

    private async areConstraintsMetFor(grid: Grid): Promise<boolean> {
        for (let i = 0; i < this.verticalWords.length; ++i) {
            const VERTICAL_WORD_PLACEMENT = this.verticalWords[i];
            const VERTICAL_WORD_CONSTRAINT =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    VERTICAL_WORD_PLACEMENT
                );
            const SUGGESTIONS_EXIST =
                await this.suggestionsGetter.doSuggestionsExist(
                    VERTICAL_WORD_PLACEMENT.minLength,
                    VERTICAL_WORD_PLACEMENT.maxLength,
                    VERTICAL_WORD_CONSTRAINT,
                    VERTICAL_WORD_PLACEMENT.position
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
            WORD_PLACEMENT.position,
            Direction.horizontal,
            Player.NO_PLAYER
        );
        grid.words.push(WORD);
        try {
            if (await this.areConstraintsMetFor(grid)) {
                if (await this.placeAcrossWords(grid, current + 1)) {
                    return true;
                }
                else {
                    grid.words.pop();
                    return false;
                }
            }
            else {
                grid.words.pop();
                return false;
            }
        }
        catch (e) {
            grid.words.pop();
            return false;
        }
    }

    private getAWordThatIsNotADuplicate(grid: Grid,
                                        suggestions: WordSuggestions): string {
        let word = '';
        const FOUND_NON_DUPLICATE = (() => word !== '');
        while (suggestions.length > 0 && !FOUND_NON_DUPLICATE()) {
            const SUGGESTION = suggestions.consumeRandomSuggestion();
            if (!grid.doesWordAlreadyExist(SUGGESTION)) {
                word = SUGGESTION;
            }
        }
        return word;
    }

}

