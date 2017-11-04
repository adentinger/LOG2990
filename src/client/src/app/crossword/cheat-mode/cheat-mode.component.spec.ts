import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheatModeComponent } from './cheat-mode.component';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { TimerService } from '../services/timer.service';
import { packetManagerClient } from '../../packet-manager.service';

describe('CheatModeComponent', () => {
    let component: CheatModeComponent;
    let fixture: ComponentFixture<CheatModeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CheatModeComponent
            ],
            providers: [
                CrosswordGameService,
                TimerService,
                {provide: PacketManagerClient, useValue: packetManagerClient}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CheatModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
