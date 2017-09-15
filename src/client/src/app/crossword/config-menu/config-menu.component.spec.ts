import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { ConfigMenuComponent } from './config-menu.component';
import { MENU_PAGES } from './menu-pages';
import { ConfigMenuService } from './config-menu.service';

describe('ConfigMenuComponent', () => {
    let component: ConfigMenuComponent;
    let fixture: ComponentFixture<ConfigMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigMenuComponent],
            providers: [
                ConfigMenuService,
                {provide: Location, useClass: SpyLocation},
                {provide: 'menuPages', useValue: MENU_PAGES}
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
