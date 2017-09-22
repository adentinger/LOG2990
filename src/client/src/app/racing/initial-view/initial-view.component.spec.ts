import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialViewComponent } from './initial-view.component';
import { MapService } from '../services/map.service';

describe('InitialViewComponent', () => {
    let component: InitialViewComponent;
    let fixture: ComponentFixture<InitialViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InitialViewComponent ],
            providers: [ MapService ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InitialViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
