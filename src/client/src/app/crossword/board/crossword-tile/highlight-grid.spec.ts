import { HighlightGrid, WhoIsSelecting } from './highlight-grid';
import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction } from '../../../../../../common/src/crossword/crossword-enums';
import { SelectedGridWord } from '../selected-grid-word';

function highlightGridForEach(highlightGrid: HighlightGrid,
    callback: (isHighlighted: WhoIsSelecting, row: number, col: number) => void) {
    for (let row = 0; row < Grid.DIMENSIONS; ++row) {
        for (let column = 0; column < Grid.DIMENSIONS; ++column) {
            callback(highlightGrid.isSelected(row, column), row, column);
        }
    }
}

describe('HighlightGrid', () => {

    it('should be created', () => {
        expect(new HighlightGrid(new SelectedGridWord())).toBeTruthy();
    });

    it('should tell that nothing is selected when constructed with null', () => {
        const HIGHLIGHT_GRID = new HighlightGrid();
        highlightGridForEach(
            HIGHLIGHT_GRID,
            (isHighlighted) => {
                expect(isHighlighted).toBe(WhoIsSelecting.noOne);
            }
        );
    });

    it('should tell which tiles are selected for a horizontal selection', () => {
        const ROW = 3;
        const COL_MIN = 2;
        const COL_MAX = 5;
        const HIGHLIGHT_GRID = new HighlightGrid(
            new SelectedGridWord(new GridWord(0, ROW, COL_MIN, COL_MAX - COL_MIN + 1, Direction.horizontal), null)
        );
        const SHOULD_BE_HIGHLIGHTED = (row: number, col: number) => {
            if (row === ROW && col >= COL_MIN && col <= COL_MAX) {
                return WhoIsSelecting.player;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };
        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

    it('should tell which tiles are selected for a vertical selection', () => {
        const ROW_MIN = 2;
        const ROW_MAX = 5;
        const COLUMN = 3;
        const HIGHLIGHT_GRID = new HighlightGrid(
            new SelectedGridWord(new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical), null)
        );
        const SHOULD_BE_HIGHLIGHTED = (row: number, col: number) => {
            if (col === COLUMN && row >= ROW_MIN && row <= ROW_MAX) {
                return WhoIsSelecting.player;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };

        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

    it('should tell which tiles are selected by both players', () => {
        const ROW_MIN = 2;
        const ROW_MAX = 5;
        const COLUMN = 3;
        const HIGHLIGHT_GRID = new HighlightGrid(
            new SelectedGridWord(new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical),
                new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical))
        );
        const SHOULD_BE_HIGHLIGHTED = (row: number, col: number) => {
            if (col === COLUMN && row >= ROW_MIN && row <= ROW_MAX) {
                return WhoIsSelecting.both;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };

        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col), 'Problem at ' + row + ',' + col);
        });
    });


});
