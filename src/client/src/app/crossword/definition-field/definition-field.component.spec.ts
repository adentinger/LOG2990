import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionFieldComponent } from './definition-field.component';
import { CrosswordGameService } from '../crossword-game.service';

describe('DefinitionFieldComponent', () => {
    let component: DefinitionFieldComponent;
    let fixture: ComponentFixture<DefinitionFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionFieldComponent],
            providers:    [CrosswordGameService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
