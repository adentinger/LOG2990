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

});
