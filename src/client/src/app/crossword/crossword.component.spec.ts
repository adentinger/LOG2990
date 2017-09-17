import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { CrosswordComponent } from './crossword.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';

describe('CrosswordComponent', () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordComponent, ConfigMenuComponent, BoardComponent, DefinitionFieldComponent],
            providers: [{provide: Location, useClass: SpyLocation}]
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
