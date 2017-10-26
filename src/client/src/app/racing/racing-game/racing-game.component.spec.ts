import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingGameComponent } from './racing-game.component';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { RacingGameService } from './racing-game.service';
import { MapService } from '../services/map.service';
import { HttpModule } from '@angular/http';

describe('RacingGameComponent', () => {
    let component: RacingGameComponent;
    let fixture: ComponentFixture<RacingGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([{ path: 'racing/racing-game/:map-name', component: RacingGameComponent}]),
                HttpModule
            ],
            declarations: [RacingGameComponent],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'},
                RacingGameService,
                MapService
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
