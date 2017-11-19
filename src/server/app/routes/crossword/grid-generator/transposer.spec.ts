import { expect } from 'chai';

import { Transposer } from './transposer';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { WordSuggestionsGetter } from './word-suggestions-getter';
import { DifficultyEasy } from '../../../../../common/src/crossword/difficulty-easy';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { GridFiller } from './grid-filler';

function placementOfFiller(filler: GridFiller): {across: WordPlacement[], vertical: WordPlacement[]} {
    return {
        across: filler.acrossPlacement.map(placement => placement.clone()),
        vertical: filler.verticalPlacement.map(placement => placement.clone())
    };
}

describe('Transposer', () => {

    it('should be created', () => {
        expect(new Transposer()).to.not.be.null;
    });

    it('should transpose a GridFiller', () => {
        const FILLER = new GridFillerFirstSection(new WordSuggestionsGetter(new DifficultyEasy()));
        const initialPlacement = placementOfFiller(FILLER);
        new Transposer().transposeFiller(FILLER);
        const transposedPlacement = placementOfFiller(FILLER);

        expect(transposedPlacement.across.length).to.equal(initialPlacement.across.length);
        expect(transposedPlacement.vertical.length).to.equal(initialPlacement.vertical.length);

        for (let i = 0; i < transposedPlacement.across.length; ++i) {
            const expectedPlacement = initialPlacement.across[i].clone();
            [expectedPlacement.position.row, expectedPlacement.position.column] =
                [expectedPlacement.position.column, expectedPlacement.position.row];
            expect(transposedPlacement.across[i].equals(expectedPlacement)).to.be.true;
        }

        for (let i = 0; i < transposedPlacement.vertical.length; ++i) {
            const expectedPlacement = initialPlacement.vertical[i].clone();
            [expectedPlacement.position.row, expectedPlacement.position.column] =
                [expectedPlacement.position.column, expectedPlacement.position.row];
            expect(transposedPlacement.vertical[i].equals(expectedPlacement)).to.be.true;
        }
    });

});
