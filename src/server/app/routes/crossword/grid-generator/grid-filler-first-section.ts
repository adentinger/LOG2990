import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class GridFillerFirstSection extends GridFiller {

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        super(suggestionsGetter);
        this.acrossWords = [
            new WordPlacement(new WordPosition(0, 0), 6, 9),
            new WordPlacement(new WordPosition(1, 0), 3, 4),
            new WordPlacement(new WordPosition(2, 0), 3, 3)
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(0, 0), 5, 8),
            new WordPlacement(new WordPosition(0, 1), 3, 4),
            new WordPlacement(new WordPosition(0, 2), 3, 3)
        ];
    }

}
