import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { SelectionService } from '../selection.service';

describe('GridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GridService, GameService,
                { provide: PacketManagerClient, useValue: packetManagerClient },
                DefinitionsService,
                SelectionService
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
