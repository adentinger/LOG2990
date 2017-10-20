import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class GridFillerThirdSection extends GridFiller {

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        super(suggestionsGetter);
        this.acrossWords = [
            new WordPlacement(new WordPosition(7, 6), 3, 4),
            new WordPlacement(new WordPosition(8, 6), 3, 3),
            new WordPlacement(new WordPosition(9, 5), 4, 5),
            new WordPlacement(new WordPosition(9, 1), 3, 3),
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(7, 6), 3, 3),
            new WordPlacement(new WordPosition(7, 7), 3, 3),
            new WordPlacement(new WordPosition(6, 8), 4, 4)
        ];
    }

}
