import { GridFiller } from './grid-filler';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class GridFillerContainer extends GridFiller {

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        super(suggestionsGetter);
    }

}
