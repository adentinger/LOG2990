import { Injectable } from '@angular/core';
import { PhysicUtils } from './utils';
import { IPhysicElement, isPhysicElement } from './object';
import * as THREE from 'three';
import { Seconds } from '../../types';
import { EventManager } from '../../../event-manager.service';

export { PhysicUtils } from './utils';

export const BEFORE_PHYSIC_UPDATE_EVENT = 'beforephysicupdate';
export const AFTER_PHYSIC_UPDATE_EVENT = 'afterphysicupdate';

@Injectable()
export class PhysicEngine {
    public static readonly UPDATE_FREQUENCY = 200; // Hz

    private physicUtils: PhysicUtils;
    private timer: any = null;

    constructor(private eventManager: EventManager) {
        this.physicUtils = new PhysicUtils(eventManager);
    }

    public setRoot(root: THREE.Object3D) {
        this.physicUtils.setRoot(root);
    }

    public start() {
        if (this.timer === null) {
            let now = Date.now(), last = now;
            this.timer = setInterval(() => {
                now = Date.now();
                const deltaTimeMs = now - last;
                this.updateWorld(deltaTimeMs / 1000);
                last = now;
            }, 1000 / PhysicEngine.UPDATE_FREQUENCY);
        }
    }

    public stop() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private updateWorld(deltaTime: Seconds) {
        this.eventManager.fireEvent(BEFORE_PHYSIC_UPDATE_EVENT, {name: BEFORE_PHYSIC_UPDATE_EVENT, data: {}});
        const objects = this.physicUtils.getAllPhysicObjects();
        objects.forEach((object) => object.update(this.physicUtils, deltaTime));
        this.eventManager.fireEvent(AFTER_PHYSIC_UPDATE_EVENT, {name: AFTER_PHYSIC_UPDATE_EVENT, data: {}});
    }
}
