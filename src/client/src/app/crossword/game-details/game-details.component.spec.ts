import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailsComponent } from './game-details.component';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';

describe('GameDetailsComponent', () => {
    let component: GameDetailsComponent;
    let fixture: ComponentFixture<GameDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameDetailsComponent],
            providers: [{provide: PacketManagerClient, useValue: packetManagerClient}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
