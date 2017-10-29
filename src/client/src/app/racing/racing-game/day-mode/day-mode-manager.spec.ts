import * as THREE from 'three';
import { inject, TestBed } from '@angular/core/testing';

import { DayModeManager, DayMode } from './day-mode-manager';

interface ThreeData {
    renderer: THREE.Renderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
}

class ThreeDataFactory {
    public make(): ThreeData {
        return {
            renderer: new THREE.WebGLRenderer(),
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera()
        };
    }
}

const THREE_DATA_FACTORY = new ThreeDataFactory();

describe('DayModeManager', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DayModeManager
            ]
        });
    });

    let dayModeManager: DayModeManager;
    let threeData: ThreeData;

    beforeEach(inject([DayModeManager], (testedInstance) => {
        dayModeManager = testedInstance;
        threeData = THREE_DATA_FACTORY.make();
    }));

    it('should be created', () => {
        expect(dayModeManager).toBeTruthy();
        expect(dayModeManager.mode).toEqual(DayMode.DAY);
    });

    it('should update a scene\'s DayModeNotifiable elements', () => {

    });

});
