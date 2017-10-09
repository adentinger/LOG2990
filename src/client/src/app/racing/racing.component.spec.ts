import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapBestTimeComponent } from './initial-view/map-best-time/map-best-time.component';
import { MapService } from './services/map.service';

describe('RacingComponent', () => {
    let component: RacingComponent;
    let fixture: ComponentFixture<RacingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RacingComponent,
                InitialViewComponent,
                MapBestTimeComponent
            ],
            providers: [
                MapService
            ]
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
