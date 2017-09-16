import { TestBed, inject } from '@angular/core/testing';

import { MapRendererService } from './map-renderer.service';
import { MapEditorService } from '../map-editor.service';

describe('MapRendererService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapRendererService, MapEditorService]
        });
    });

    it('should be created', inject([MapRendererService], (service: MapRendererService) => {
        expect(service).toBeTruthy();
    }));
});
