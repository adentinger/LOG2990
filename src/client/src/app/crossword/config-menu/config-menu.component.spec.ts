import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ConfigMenuComponent } from './config-menu.component';
import { AvailableGamesComponent } from './available-games/available-games.component';
import { WaitingComponent } from './waiting/waiting.component';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { GameService } from '../game.service';
import { GameHttpService } from '../services/game-http.service';

describe('ConfigMenuComponent', () => {
    let component: ConfigMenuComponent;
    let fixture: ComponentFixture<ConfigMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            declarations: [
                ConfigMenuComponent,
                AvailableGamesComponent,
                WaitingComponent
            ],
            providers: [
                GameService,
                GameHttpService,
                {provide: PacketManagerClient, useValue: packetManagerClient}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
