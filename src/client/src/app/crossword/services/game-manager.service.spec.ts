import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GameManagerService } from './game-manager.service';
import { GameService } from '../game.service';
import { UserChoiceService } from '../config-menu/user-choice.service';
import { GameHttpService } from './game-http.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { GridService } from '../board/grid.service';
import { WaitingService } from '../config-menu/waiting/waiting.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { SelectionService } from '../selection.service';

describe('GameManagerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                { provide: PacketManagerClient, useValue: packetManagerClient },
                GameManagerService,
                GameHttpService,
                GameService,
                UserChoiceService,
                DefinitionsService,
                GridService,
                WaitingService,
                SelectionService
            ]
        });
    });

    it('should be created', inject([GameManagerService], (service: GameManagerService) => {
        expect(service).toBeTruthy();
    }));

});
