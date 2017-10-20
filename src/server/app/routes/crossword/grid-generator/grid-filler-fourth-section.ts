import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class GridFillerFourthSection extends GridFiller {

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        super(suggestionsGetter);
        this.verticalWords = [
            new WordPlacement(new WordPosition(1, 9), 4, 5)
        ];
    }

}