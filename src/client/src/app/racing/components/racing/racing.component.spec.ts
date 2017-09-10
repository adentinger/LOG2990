import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingComponent } from './racing.component';

describe('RacingComponent', () => {
    let component: RacingComponent;
    let fixture: ComponentFixture<RacingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RacingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
