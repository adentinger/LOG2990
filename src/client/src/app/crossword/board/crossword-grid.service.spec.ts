import { TestBed, inject } from '@angular/core/testing';

import { CrosswordGridService } from './crossword-grid.service';

describe('CrosswordGridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordGridService]
        });
    });

    it('should be created', inject([CrosswordGridService], (service: CrosswordGridService) => {
        expect(service).toBeTruthy();
    }));

    it('the first square should contain a character', inject([CrosswordGridService], (service: CrosswordGridService) => {
        const firstLetter = service.getViewableGrid()[0][0];
        expect(firstLetter).toMatch('.');
    }));

    it('should return an array', inject([CrosswordGridService], (service: CrosswordGridService) => {
        const grid: any = service.getViewableGrid();
        expect(grid).toEqual(jasmine.any(Array));
    }));

    it('should be 10 square high', inject([CrosswordGridService], (service: CrosswordGridService) => {
        const grid: any = service.getViewableGrid();
        expect(grid.length).toEqual(10);
    }));

    it('should be 10 square wide', inject([CrosswordGridService], (service: CrosswordGridService) => {
        const grid: any = service.getViewableGrid()[0];
        expect(grid.length).toEqual(10);
    }));

    it('should be filled with at least 35% letters', inject([CrosswordGridService], (service: CrosswordGridService) => {
        const grid: any = service.getViewableGrid();
        const regex = new RegExp('[a-zA-Z]');
        let counter = 0;
        for (const row of grid) {
            for (const square of row) {
                if (regex.test(square)) {
                    counter++;
                }
            }
        }
        expect(counter).toBeGreaterThan(35);
    }));

});
