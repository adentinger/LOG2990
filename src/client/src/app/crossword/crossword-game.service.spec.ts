import { TestBed, inject } from '@angular/core/testing';

import { CrosswordGameService} from './crossword-game.service';
import { PacketManagerClient } from '../packet-manager-client';
import { packetManagerClient } from '../packet-manager.service';

describe('CrosswordGridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordGameService, {provide: PacketManagerClient, useValue: packetManagerClient}]
        });
    });

    it('should be created', inject([CrosswordGameService], (service: CrosswordGameService) => {
        expect(service).toBeTruthy();
    }));

    it('the service should return something', inject([CrosswordGameService],
        (service: CrosswordGameService) => {
        expect(service.getCurrentGame()).toBeDefined();
    }));

    it('the game should have a property "player1"', inject([CrosswordGameService],
        (service: CrosswordGameService) => {
        expect(service.getCurrentGame().player1).toBeDefined();
    }));

    it('the game should have a property "player2"', inject([CrosswordGameService],
        (service: CrosswordGameService) => {
        expect(service.getCurrentGame().player2).toBeDefined();
    }));

    it('the game should have a property "difficulty"', inject([CrosswordGameService],
        (service: CrosswordGameService) => {
        expect(service.getCurrentGame().difficulty).toBeDefined();
    }));

    it('the game should have a property "gameMode"', inject([CrosswordGameService],
        (service: CrosswordGameService) => {
        expect(service.getCurrentGame().gameMode).toBeDefined();
    }));
});
