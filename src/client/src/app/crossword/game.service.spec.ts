import { TestBed, inject } from '@angular/core/testing';

import { GameService} from './game.service';
import { PacketManagerClient } from '../packet-manager-client';
import { packetManagerClient } from '../packet-manager.service';

describe('gridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GameService,
                {provide: PacketManagerClient, useValue: packetManagerClient}
            ]
        });
    });

    let gameService: GameService;

    beforeEach(inject([GameService], (injectedgameService) => {
        gameService = injectedgameService;
    }));

    it('should be created', () => {
        expect(gameService).toBeTruthy();
    });

    it('the service should return something', () => {
        expect(gameService.getCurrentGame()).toBeDefined();
    });

    it('the game should have a property "player1"', () => {
        expect(gameService.getCurrentGame().player1).toBeDefined();
    });

    it('the game should have a property "player2"', () => {
        expect(gameService.getCurrentGame().player2).toBeDefined();
    });

    it('the game should have a property "difficulty"', () => {
        expect(gameService.getCurrentGame().difficulty).toBeDefined();
    });

    it('the game should have a property "gameMode"', () => {
        expect(gameService.getCurrentGame().gameMode).toBeDefined();
    });
});
