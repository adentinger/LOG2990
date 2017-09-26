import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEditorComponent } from './map-editor.component';
import { FormsModule } from '@angular/forms';

describe('MapEditorComponent', () => {
    let component: MapEditorComponent;
    let fixture: ComponentFixture<MapEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MapEditorComponent],
            imports: [FormsModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
