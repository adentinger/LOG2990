import { GridFiller } from './grid-filler';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class GridFillerContainer extends GridFiller {

    private readonly fillers: GridFiller[];

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        super(suggestionsGetter);
        this.fillers = [
            new GridFillerFirstSection (suggestionsGetter),
            new GridFillerSecondSection(suggestionsGetter),
            new GridFillerThirdSection (suggestionsGetter),
            new GridFillerFourthSection(suggestionsGetter)
        ];
    }

}
