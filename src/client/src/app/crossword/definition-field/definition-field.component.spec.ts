import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionFieldComponent } from './definition-field.component';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from './definitions.service';
import { GridService } from '../board/grid.service';
import { SelectionService } from '../selection.service';

describe('DefinitionFieldComponent', () => {
    let component: DefinitionFieldComponent;
    let fixture: ComponentFixture<DefinitionFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionFieldComponent],
            providers: [
                GameService,
                { provide: PacketManagerClient, useValue: packetManagerClient },
                DefinitionsService,
                GridService,
                SelectionService
            ]
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
