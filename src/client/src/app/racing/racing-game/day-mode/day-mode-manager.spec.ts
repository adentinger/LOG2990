import * as THREE from 'three';
import { inject, TestBed } from '@angular/core/testing';

import { DayModeManager, DayMode } from './day-mode-manager';
import { DayModeNotifiable } from './day-mode-notifiable';

class DayModeNotifiableImplementer extends THREE.Object3D implements DayModeNotifiable {

    constructor(public callback: (newMode: DayMode) => void) {
        super();
    }

    public dayModeChanged(newMode: DayMode): void {
        this.callback(newMode);
    }

}

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

    public addObjects(data: ThreeData, callback: (newMode: DayMode) => void): void {
        const OBJECTS: THREE.Object3D[] = [
            new THREE.Object3D(),
            new THREE.Object3D(),
            new DayModeNotifiableImplementer(callback),
            new THREE.Object3D(),
            new DayModeNotifiableImplementer(callback),
            new DayModeNotifiableImplementer(callback),
            new THREE.Object3D(),
            new DayModeNotifiableImplementer(callback)
        ];
        data.scene.add(...OBJECTS);
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

        let numberOfUpdates = 0;

        THREE_DATA_FACTORY.addObjects(
            threeData,
            (newMode) => {
                ++numberOfUpdates;
            }
        );

        dayModeManager.updateScene(threeData.scene);

        const EXPECTED_NUMBER_OF_UPDATES = 4;
        expect(numberOfUpdates).toEqual(EXPECTED_NUMBER_OF_UPDATES);

    });

});
