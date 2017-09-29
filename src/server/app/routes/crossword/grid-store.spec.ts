import { expect, assert } from 'chai';

import { GridStore } from './grid-store';
import { Grid } from '../../../../common/grid';

describe('Grid store service', () => {
    let gridStore: GridStore;

    it('should be created', () => {
        gridStore = new GridStore();
        expect(gridStore).to.not.be.null;
    });

    beforeEach(() => {
        gridStore = new GridStore();
    });

    it('getGrid() should return a grid', () => {
        gridStore.getGrid().then(grids => {
            assert.typeOf(grids, 'Grid')

        });
    });

    it('getGrid() should contains 5 grids', ()=> {
        expect(gridStore['gridArray.length']).to.be.equal(5);
    });
});