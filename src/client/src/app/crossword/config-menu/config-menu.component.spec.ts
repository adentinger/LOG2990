import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigMenuComponent } from './config-menu.component';
import { ConfigMenuService, MENU_CONFIG_URL } from './config-menu.service';

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
                { provide: MENU_CONFIG_URL, useValue: '/crossword/games/pending/10' }
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
