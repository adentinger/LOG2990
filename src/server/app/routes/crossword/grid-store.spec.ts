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
        // expect(gridStore.getGrid()).to.be.
        assert.typeOf(gridStore.getGrid(), Grid);
    });

    it('should be created', inject([BasicService], (service: BasicService) => {
        expect(service).toBeTruthy();
    }));
});
