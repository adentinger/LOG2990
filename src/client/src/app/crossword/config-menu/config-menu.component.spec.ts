import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigMenuComponent } from './config-menu.component';
import { AvailableGamesComponent } from './available-games/available-games.component';

describe('ConfigMenuComponent', () => {
    let component: ConfigMenuComponent;
    let fixture: ComponentFixture<ConfigMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigMenuComponent,
                AvailableGamesComponent
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
