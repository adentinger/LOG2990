import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigMenuComponent } from './config-menu.component';
import { ConfigMenuService, MENU_CONFIG_URL } from './config-menu.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { CrosswordGameService } from '../crossword-game.service';

describe('ConfigMenuComponent', () => {
    let component: ConfigMenuComponent;
    let fixture: ComponentFixture<ConfigMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [ConfigMenuComponent],
            providers: [
                ConfigMenuService,
                {provide: Location, useClass: SpyLocation},
                { provide: MENU_CONFIG_URL, useValue: '/crossword/games/pending/10' },
                {provide: PacketManagerClient, useValue: packetManagerClient},
                CrosswordGameService
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
