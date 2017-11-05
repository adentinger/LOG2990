import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableGamesComponent } from './available-games.component';

describe('AvailableGamesComponent', () => {
    let component: AvailableGamesComponent;
    let fixture: ComponentFixture<AvailableGamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ AvailableGamesComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AvailableGamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
