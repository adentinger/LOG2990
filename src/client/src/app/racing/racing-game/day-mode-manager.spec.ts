import { inject, TestBed } from '@angular/core/testing';

import { DayModeManager, DayMode } from './day-mode-manager';

describe('DayModeManager', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DayModeManager
            ]
        });
    });

    let dayModeManager: DayModeManager;
    let threeData: {
        renderer: THREE.Renderer;
        scene: THREE.Scene;
        camera: THREE.Camera;
    };

    beforeEach(inject([DayModeManager], (testedInstance) => {
        dayModeManager = testedInstance;
    }));

    it('should be created', () => {
        expect(dayModeManager).toBeTruthy();
        expect(dayModeManager.mode).toEqual(DayMode.DAY);
    });

    it('should update a scene\'s DayModeNotifiable elements', () => {
        
    });

});
