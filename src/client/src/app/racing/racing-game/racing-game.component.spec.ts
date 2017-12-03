import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { RacingGameComponent } from './racing-game.component';
import { RacingGameService } from './racing-game.service';
import { MapService } from '../services/map.service';
import { UIInputs } from '../services/ui-input.service';
import { EventManager } from '../../event-manager.service';
import { PhysicEngine } from './physic/engine';
import { SoundService } from '../services/sound-service';
import { CarsService } from './cars.service';
import { CarsProgressionService } from './cars-progression.service';
import { BestTimeComponent } from './end-view/best-time/best-time.component';
import { MapRatingComponent } from './end-view/map-rating/map-rating.component';

describe('RacingGameComponent', () => {
    let component: RacingGameComponent;
    let fixture: ComponentFixture<RacingGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([{ path: 'racing/racing-game/:map-name', component: RacingGameComponent }]),
                HttpModule,
                NoopAnimationsModule
            ],
            declarations: [RacingGameComponent, UIInputs, MapRatingComponent, BestTimeComponent],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                RacingGameService,
                MapService,
                EventManager,
                PhysicEngine,
                CarsService,
                CarsProgressionService,
                SoundService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
