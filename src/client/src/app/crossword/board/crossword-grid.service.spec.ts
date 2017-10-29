import { TestBed, inject } from '@angular/core/testing';

import { CrosswordGridService } from './crossword-grid.service';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from '../definition-field/definitions.service';

describe('CrosswordGridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordGridService, CrosswordGameService,
                { provide: PacketManagerClient, useValue: packetManagerClient },
                DefinitionsService
            ]
        });
    });

    let crosswordGridService: CrosswordGridService;

    beforeEach(inject([CrosswordGridService], (injectedService) => {
        crosswordGridService = injectedService;
    }));

    it('should be created', () => {
        expect(crosswordGridService).toBeTruthy();
    });

    it('the first square should not contain a character', () => {
        const firstLetter = crosswordGridService.getViewableGrid()[0][0];
        expect(firstLetter).toMatch(/^$/i);
    });

    it('should return an array', () => {
        const grid: any = crosswordGridService.getViewableGrid();
        expect(grid).toEqual(jasmine.any(Array));
    });

    it('should be 10 square high', () => {
        const grid: any = crosswordGridService.getViewableGrid();
        expect(grid.length).toEqual(10);
    });

    it('should be 10 square wide', () => {
        const grid: any = crosswordGridService.getViewableGrid()[0];
        expect(grid.length).toEqual(10);
    });

    it('should be filled with at least 35% letters', () => {
        const grid: any = crosswordGridService.getViewableGrid();
        const regex = new RegExp('^0$');
        let counter = 0;
        for (const row of grid) {
            for (const square of row) {
                if (regex.test(square)) {
                    counter++;
                }
            }
        }
        expect(100 - counter).toBeGreaterThan(35);
    });

});
