import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GameHttpService } from './game-http.service';
import { GameService } from '../game.service';
import { packetManagerClient } from '../../packet-manager.service';
import { PacketManagerClient } from '../../packet-manager-client';

describe('GameHttpService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GameHttpService,
                GameService,
                { provide: PacketManagerClient, useValue: packetManagerClient }
            ],
            imports: [
                HttpClientModule
            ]
        });
    });

    it('should be created', inject([GameHttpService], (service: GameHttpService) => {
        expect(service).toBeTruthy();
    }));
});
