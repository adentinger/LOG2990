import { TestBed, inject } from '@angular/core/testing';
import { Owner } from '../../../../../common/crossword/crossword-enums';

import { CrosswordGridService } from './crossword-grid.service';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

describe('CrosswordGridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordGridService, GameService,
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

    it('should be able to indicate that a word is found', () => {
        crosswordGridService['GRID']['words'][0].owner = Owner.player1;
        expect(crosswordGridService.checkIfWordIsFound(0, Direction.horizontal)).toBeTruthy();
    });

    it('should be able to detect that a word isn\'t found', () => {
        crosswordGridService['GRID']['words'][0].owner = Owner.player1;
        // we check a different word
        expect(crosswordGridService.checkIfWordIsFound(1, Direction.horizontal)).toBeFalsy();
    });
});
