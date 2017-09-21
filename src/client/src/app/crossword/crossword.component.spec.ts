import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { CrosswordComponent } from './crossword.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GameDetailsComponent } from './game-details/game-details.component';

describe('CrosswordComponent', () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [CrosswordComponent, ConfigMenuComponent, BoardComponent, DefinitionFieldComponent, GameDetailsComponent],
            providers: [HttpClient, {provide: Location, useClass: SpyLocation}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
