import { TestBed, inject } from '@angular/core/testing';

import { GameService} from './game.service';
import { PacketManagerClient } from '../packet-manager-client';
import { packetManagerClient } from '../packet-manager.service';

describe('CrosswordGridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GameService,
                {provide: PacketManagerClient, useValue: packetManagerClient}
            ]
        });
    });

    let crosswordGameService: GameService;

    beforeEach(inject([GameService], (injectedCrosswordGameService) => {
        crosswordGameService = injectedCrosswordGameService;
    }));

    it('should be created', () => {
        expect(crosswordGameService).toBeTruthy();
    });

    it('the service should return something', () => {
        expect(crosswordGameService.getCurrentGame()).toBeDefined();
    });

    it('the game should have a property "player1"', () => {
        expect(crosswordGameService.getCurrentGame().player1).toBeDefined();
    });

    it('the game should have a property "player2"', () => {
        expect(crosswordGameService.getCurrentGame().player2).toBeDefined();
    });

    it('the game should have a property "difficulty"', () => {
        expect(crosswordGameService.getCurrentGame().difficulty).toBeDefined();
    });

    it('the game should have a property "gameMode"', () => {
        expect(crosswordGameService.getCurrentGame().gameMode).toBeDefined();
    });
});
