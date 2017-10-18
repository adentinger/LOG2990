import { expect } from 'chai';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { Grid } from './grid';
import { DifficultyEasy } from './difficulty-easy';
import { NormalWordSuggestionsGetter } from './normal-word-suggestions-getter';
import { GridFiller } from './grid-filler';
import { Constructor } from '../../../common';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';

function testGridFiller<T extends GridFiller>(testName: string,
                        constructor: Constructor<T>) {
    describe(testName, () => {

        let filler: T;

        beforeEach(() => {
            filler = new constructor(
                new NormalWordSuggestionsGetter(new DifficultyEasy()));
        });

        it('should be created', () => {
            expect(filler).to.be.ok;
        });

        it('should fill grids', () => {
            const GRID = new Grid();
            filler.fill(GRID);
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
            filler.verticalPlacement.forEach((placement) => {
                const MATCH_INDEX = GRID.vertical.findIndex((verticalWord) => {
                    const WORD_LENGTH_MATCHES =
                        verticalWord.value.length >= placement.minLength &&
                        verticalWord.value.length <= placement.maxLength;
                    const PLACEMENT_MATCHES = placement.position.equals(verticalWord.position);
                    return WORD_LENGTH_MATCHES && PLACEMENT_MATCHES;
                });
                expect(MATCH_INDEX).to.be.gte(0, 'Placement requirement not met');
            });
        });

    });
}

testGridFiller('GridFillerFirstSection', GridFillerFirstSection);
testGridFiller('GridFillerSecondSection', GridFillerSecondSection);
testGridFiller('GridFillerThirdSection', GridFillerThirdSection);
testGridFiller('GridFillerFourthSection', GridFillerFourthSection);
