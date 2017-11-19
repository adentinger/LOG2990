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
        const initialNumberOfWords = grid.words.length;
        let done = false;
        while (!done) {
            while (grid.words.length > initialNumberOfWords) {
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

    private async placeAcrossWords(grid: Grid, recursionDepth: number = 0): Promise<boolean> {
        // We assume that the words in acrossWords and verticalWords
        // are given top to bottom and left to right (respectively).
        if (recursionDepth < this.acrossWords.length) {

            if (this.shouldCancelFilling) {
                throw new Error('Grid generation cancelled.');
            }

            const wordPlacement = this.acrossWords[recursionDepth];
            const suggestions =
                await this.suggestionsGetter.getSuggestions(
                    wordPlacement.minLength,
                    wordPlacement.maxLength,
                    [],
                    wordPlacement.position
                );

            let done = false;
            let numTriesLeft = GridFiller.NUM_TRIES;
            while (numTriesLeft > 0 && suggestions.length > 0 && !done) {
                const suggestion = this.getAWordThatIsNotADuplicate(grid, suggestions);
                if (suggestion !== '') {
                    done = await this.trySuggestion(
                        grid,
                        suggestion,
                        recursionDepth
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
            const placement = this.verticalWords[i];
            const constraint =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    placement
                );
            const suggestions = await this.suggestionsGetter.getSuggestions(
                placement.minLength,
                placement.maxLength,
                constraint,
                placement.position
            );
            // We know that there is at least one suggestion
            const suggestion = this.getAWordThatIsNotADuplicate(grid, suggestions);
            if (suggestion !== '') {
                const word = new Word(
                    suggestion,
                    placement.position,
                    Direction.vertical,
                    Player.NO_PLAYER
                );
                grid.words.push(word);
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
            const verticalWordPlacement = this.verticalWords[i];
            const verticalWordConstraint =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    verticalWordPlacement
                );
            const suggestionsExist =
                await this.suggestionsGetter.doSuggestionsExist(
                    verticalWordPlacement.minLength,
                    verticalWordPlacement.maxLength,
                    verticalWordConstraint,
                    verticalWordPlacement.position
                );
            if (!suggestionsExist) {
                return false;
            }
        }
        return true;
    }

    private async trySuggestion(grid: Grid, suggestion: string, current: number): Promise<boolean> {
        const wordPlacement = this.acrossPlacement[current];
        const word = new Word(
            suggestion,
            wordPlacement.position,
            Direction.horizontal,
            Player.NO_PLAYER
        );
        grid.words.push(word);
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
            const suggestion = suggestions.consumeRandomSuggestion();
            if (!grid.doesWordAlreadyExist(suggestion)) {
                word = suggestion;
            }
        }
        return word;
    }

}

