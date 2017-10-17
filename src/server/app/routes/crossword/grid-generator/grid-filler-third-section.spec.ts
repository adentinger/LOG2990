import { expect } from 'chai';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { Grid, Difficulty } from './grid';

describe('GridFillerThirdSection', () => {

    let filler: GridFillerThirdSection;

    beforeEach(() => {
        filler = new GridFillerThirdSection(Difficulty.easy);
    });

    it('should be created', () => {
        expect(filler).to.be.ok;
    });

    it('should fill grids', () => {
        const GRID = new Grid();
        filler.fill(GRID);
        expect(GRID.isCurrentlyValid).to.be.true;
        filler.acrossPlacement.forEach((placement) => {
            const MATCH_INDEX = GRID.across.findIndex((acrossWord) => {
                const WORD_LENGTH_MATCHES =
                    acrossWord.value.length >= placement.minLength &&
                    acrossWord.value.length <= placement.maxLength;
                const PLACEMENT_MATCHES = placement.position.equals(acrossWord.position);
                return WORD_LENGTH_MATCHES && PLACEMENT_MATCHES;
            });
            expect(MATCH_INDEX).to.be.gte(0, 'Placement requirement not met');
        });
    });

});
