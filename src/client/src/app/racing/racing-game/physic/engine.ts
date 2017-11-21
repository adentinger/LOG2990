import { Injectable } from '@angular/core';
import { PhysicUtils } from './utils';
import * as THREE from 'three';
import { Seconds } from '../../../types';
import { EventManager } from '../../../event-manager.service';

export { PhysicUtils } from './utils';

export const BEFORE_PHYSIC_UPDATE_EVENT = 'beforephysicupdate';
export const AFTER_PHYSIC_UPDATE_EVENT = 'afterphysicupdate';

@Injectable()
export class PhysicEngine {
    public static readonly UPDATE_FREQUENCY = 70; // Hz

    private physicUtils: PhysicUtils;
    private timer: any = null;

    private sampleSize = 20;
    private deltaTimes: Seconds[] = [];
    public get tps(): number {
        return (this.deltaTimes.length / this.deltaTimes.reduce((accumulator, value) => accumulator + value, 0)) || 0;
    }

    constructor(private eventManager: EventManager) {
        this.physicUtils = new PhysicUtils(eventManager);
    }

    public initialize(root: THREE.Object3D): void {
        this.physicUtils.setRoot(root);
    }

    public finalize(): void {
        delete this.physicUtils['root'];
    }

    public start(): void {
        if (this.timer === null) {
            let now = Date.now(), last = now;
            this.timer = setInterval(() => {
                now = Date.now();
                const deltaTimeMs = now - last;
                this.updateWorld(deltaTimeMs / 1000);
                if (this.deltaTimes.length >= this.sampleSize) {
                    this.deltaTimes.splice(0, this.deltaTimes.length - this.sampleSize + 1);
                }
                this.deltaTimes.push(deltaTimeMs / 1000);
                last = now;
            }, 1000 / PhysicEngine.UPDATE_FREQUENCY); // facteur de conversion entre ms et s
        }
    }

    public stop(): void {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private updateWorld(deltaTime: Seconds): void {
        this.eventManager.fireEvent(BEFORE_PHYSIC_UPDATE_EVENT, {name: BEFORE_PHYSIC_UPDATE_EVENT, data: {}});
        const objects = this.physicUtils.getAllPhysicObjects();
        objects.forEach((object) => object.updatePhysic(this.physicUtils, deltaTime));
        this.eventManager.fireEvent(AFTER_PHYSIC_UPDATE_EVENT, {name: AFTER_PHYSIC_UPDATE_EVENT, data: {}});
    }
}
