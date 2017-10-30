import { TestBed, inject } from '@angular/core/testing';

import { ViewableGrid } from './viewable-grid';
import { Grid } from './grid';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

function viewableGridCompare(viewableGrid: ViewableGrid,
                             expected: string[][]) {
    for (let row = 0; row < Grid.DIMENSIONS; ++row) {
        for (let column = 0; column < Grid.DIMENSIONS; ++column) {
            expect(viewableGrid.getCharAt(row, column))
                .toEqual(expected[row][column]);
        }
    }
}

function horizontalWords(): GridWord[] {
    const DIRECTION = Direction.horizontal;
    const OWNER = Owner.none;
    return [
        new GridWord(0, 0, 0, 5,  DIRECTION, OWNER, ''),
        new GridWord(0, 2, 3, 7,  DIRECTION, OWNER, 'fghijkl'),
        new GridWord(0, 4, 1, 3,  DIRECTION, OWNER, ''),
        new GridWord(0, 4, 6, 1,  DIRECTION, OWNER, 'r'),
        new GridWord(0, 6, 0, 10, DIRECTION, OWNER, ''),
        new GridWord(0, 6, 2, 5,  DIRECTION, OWNER, 'abcde'),
        new GridWord(0, 9, 4, 3,  DIRECTION, OWNER, 'fgh'),
        new GridWord(0, 9, 8, 2,  DIRECTION, OWNER, ''),
    ];
}

function verticalWords(): GridWord[] {
    const DIRECTION = Direction.horizontal;
    const OWNER = Owner.none;
    return [
        new GridWord(0, 0, 0, 3,  DIRECTION, OWNER, 'abc'),
        new GridWord(0, 0, 2, 1,  DIRECTION, OWNER, 'c'),
        new GridWord(0, 3, 2, 7,  DIRECTION, OWNER, ''),
        new GridWord(0, 0, 4, 4,  DIRECTION, OWNER, ''),
        new GridWord(0, 7, 5, 3,  DIRECTION, OWNER, ''),
        new GridWord(0, 4, 6, 1,  DIRECTION, OWNER, 'r'),
        new GridWord(0, 0, 9, 10, DIRECTION, OWNER, 'abldefzstj'),
    ];
}

function expectedBlack(): string[][] {
    const DATA: string[][] = [];
    for (let i = 0; i < Grid.DIMENSIONS; ++i) {
        DATA.push([]);
        for (let j = 0; j < Grid.DIMENSIONS; ++j) {
            DATA[i].push(Grid.BLACK_TILE);
        }
    }
    return DATA;
}

function expectedHorizontal(): string[][] {
    const B = Grid.BLACK_TILE;
    const E = Grid.EMPTY_TILE;
    return [
        [ E ,  E ,  E ,  E ,  E ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  B ,  B , 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ E ,  E ,  E ,  B ,  B ,  B , 'r',  B ,  B ,  B ],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  B , 'a', 'b', 'c', 'd', 'e',  B ,  B ,  B ],
        [ B ,  B ,  B ,  B , 'f', 'g', 'h',  B , 'i', 'j']
    ];
}

function expectedVertical(): string[][] {
    const B = Grid.BLACK_TILE;
    const E = Grid.EMPTY_TILE;
    return [
        ['a',  B , 'c',  B ,  E ,  B ,  B ,  B ,  B , 'a'],
        ['b',  B ,  B ,  B ,  E ,  B ,  B ,  B ,  B , 'b'],
        ['c',  B ,  B ,  B ,  E ,  B ,  B ,  B ,  B , 'l'],
        [ B ,  B ,  E ,  B ,  E ,  B ,  B ,  B ,  B , 'd'],
        [ B ,  B ,  E ,  B ,  B ,  B , 'r',  B ,  B , 'e'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'f'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'z'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 's'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 't'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'j']
    ];
}

function expectedHorizontalAndVertical(): string[][] {
    const B = Grid.BLACK_TILE;
    const E = Grid.EMPTY_TILE;
    return [
        ['a',  E , 'c',  E ,  E ,  B ,  B ,  B ,  B , 'a'],
        ['b',  B ,  B ,  B ,  E ,  B ,  B ,  B ,  B , 'b'],
        ['c',  B ,  B , 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
        [ B ,  B ,  E ,  B ,  E ,  B ,  B ,  B ,  B , 'd'],
        [ B ,  E ,  E ,  E ,  B ,  B , 'r',  B ,  B , 'e'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'f'],
        [ E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ,  E , 'z'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 's'],
        [ B ,  B , 'a', 'b', 'c', 'd', 'e',  B ,  B , 't'],
        [ B ,  B ,  E ,  B , 'f', 'g', 'h',  B , 'i', 'j']
    ];
}

describe('ViewableGrid', () => {

    it('should be created', () => {
        expect(new ViewableGrid()).toBeTruthy();
    });

    it('should be full of black tiles when constructed with no words', () => {
        const VIEWABLE_GRID = new ViewableGrid([]);
        viewableGridCompare(
            VIEWABLE_GRID,
            expectedBlack()
        );
    });

    it('should place horizontal words', () => {
        const VIEWABLE_GRID = new ViewableGrid(horizontalWords());
        viewableGridCompare(
            VIEWABLE_GRID,
            expectedHorizontal()
        );
    });

    it('should place vertical words', () => {
        const VIEWABLE_GRID = new ViewableGrid(verticalWords());
        viewableGridCompare(
            VIEWABLE_GRID,
            expectedVertical()
        );
    });

    it('should place a mixture of horizontal and vertical words', () => {
        const VIEWABLE_GRID = new ViewableGrid(horizontalWords()
                                  .concat(verticalWords()));
        viewableGridCompare(
            VIEWABLE_GRID,
            expectedHorizontalAndVertical()
        );
    });

});
