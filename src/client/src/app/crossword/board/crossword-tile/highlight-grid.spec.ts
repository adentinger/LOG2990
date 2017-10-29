import { HighlightGrid } from './highlight-grid';
import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction } from '../../../../../../common/src/crossword/crossword-enums';

function highlightGridForEach(highlightGrid: HighlightGrid,
                              callback: (isHighlighted: boolean, row: number, col: number) => void) {
    for (let row = 0; row < Grid.DIMENSIONS; ++row) {
        for (let column = 0; column < Grid.DIMENSIONS; ++column) {
            callback(highlightGrid.isSelected(row, column), row, column);
        }
    }
}

describe('HighlightGrid', () => {

    it('should be created', () => {
        expect(new HighlightGrid(new GridWord())).toBeTruthy();
    });

    it('should tell that nothing is selected when constructed with null', () => {
        const HIGHLIGHT_GRID = new HighlightGrid(null);
        highlightGridForEach(
            HIGHLIGHT_GRID,
            (isHighlighted) => {
                expect(isHighlighted).toBe(false);
            }
        );
    });

    it('should tell which tiles are selected for a horizontal selection', () => {
        const ROW = 3;
        const COL_MIN = 2;
        const COL_MAX = 5;
        const HIGHLIGHT_GRID = new HighlightGrid(
            new GridWord(0, ROW, COL_MIN, COL_MAX - COL_MIN + 1, Direction.horizontal)
        );
        const SHOULD_BE_HIGHLIGHTED =
            (row: number, col: number) => row === ROW && col >= COL_MIN && col <= COL_MAX;

        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col));
        });
    });

    it('should tell which tiles are selected for a vertical selection', () => {
        const ROW_MIN = 2;
        const ROW_MAX = 5;
        const COLUMN = 3;
        const HIGHLIGHT_GRID = new HighlightGrid(
            new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical)
        );
        const SHOULD_BE_HIGHLIGHTED =
            (row: number, col: number) => col === COLUMN && row >= ROW_MIN && row <= ROW_MAX;

        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col));
        });
    });


});
