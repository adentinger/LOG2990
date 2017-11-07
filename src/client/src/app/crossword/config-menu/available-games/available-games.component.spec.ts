import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AvailableGamesComponent } from './available-games.component';
import { GameHttpService } from '../../services/game-http.service';
import { MenuAutomatonService } from '../menu-automaton.service';
import { UserChoiceService } from '../user-choice.service';

describe('AvailableGamesComponent', () => {
    let component: AvailableGamesComponent;
    let fixture: ComponentFixture<AvailableGamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AvailableGamesComponent,
            ],
            imports: [
                HttpClientModule
            ],
            providers: [
                GameHttpService,
                MenuAutomatonService,
                UserChoiceService
            ]
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
