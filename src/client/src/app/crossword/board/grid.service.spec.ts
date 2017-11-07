import { TestBed, inject } from '@angular/core/testing';
import { Owner } from '../../../../../common/crossword/crossword-enums';

import { GridService } from './grid.service';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

describe('GridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GridService, GameService,
                { provide: PacketManagerClient, useValue: packetManagerClient },
                DefinitionsService
            ]
        });
    });

    let gridService: GridService;

    beforeEach(inject([GridService], (injectedService) => {
        gridService = injectedService;
    }));

    it('should be created', () => {
        expect(gridService).toBeTruthy();
    });

    it('should be able to indicate that a word is found', () => {
        gridService['GRID']['words'][0].owner = Owner.player1;
        expect(gridService.checkIfWordIsFound(0, Direction.horizontal)).toBeTruthy();
    });

    it('should be able to detect that a word isn\'t found', () => {
        gridService['GRID']['words'][0].owner = Owner.player1;
        // we check a different word
        expect(gridService.checkIfWordIsFound(1, Direction.horizontal)).toBeFalsy();
    });
});
