import { Injectable } from '@angular/core';
import { NotImplementedError } from '../../../../../../common/src/utils';
import { IPhysicObject } from './physic-object';
import { Collidable } from './collidable';

@Injectable()
export class PhysicEngine {
    public static readonly UPDATE_FREQUENCY = 60; // Hz

    private root: IPhysicObject;
    private timer: any = null;

    constructor() { }

    public setRoot(root: IPhysicObject) {
        this.root = root;
    }

    public start() {
        if (this.timer !== null) {
            let now = Date.now(), last = now;
            this.timer = setInterval(() => {
                now = Date.now();
                this.updateWorld(now - last);
                last = now;
            }, 1000 / PhysicEngine.UPDATE_FREQUENCY);
        }
    }

    public isColliding(object1: Collidable, object2: Collidable): boolean {
        object1.geometry.computeBoundingBox();
        object2.geometry.computeBoundingBox();
        return object1.geometry.boundingBox.intersectsBox(object2.geometry.boundingBox);
    }

    private updateWorld(deltaTime: number) {
        throw new NotImplementedError();
    }
}
