import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from '../word-position';
import { WordSuggestionsGetter } from './word-suggestions-getter';

export class GridFillerSecondSection extends GridFiller {

    constructor(suggestionsGetter: WordSuggestionsGetter) {
        super(suggestionsGetter);
        this.acrossWords = [
            new WordPlacement(new WordPosition(3, 3), 3, 5),
            new WordPlacement(new WordPosition(4, 3), 3, 3),
            new WordPlacement(new WordPosition(5, 5), 3, 3),
            new WordPlacement(new WordPosition(6, 3), 3, 3)
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(3, 3), 4, 5),
            new WordPlacement(new WordPosition(2, 4), 3, 3),
            new WordPlacement(new WordPosition(3, 5), 4, 4)
        ];
    }

}
