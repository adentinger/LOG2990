import { Injectable } from '@angular/core';
import { NotImplementedError } from '../../../../../../common/src/utils';
import { IPhysicElement } from './object';
import { Collidable, isCollidable } from './collidable';
import * as THREE from 'three';
import { Seconds } from '../../types';

@Injectable()
export class PhysicEngine {
    public static readonly UPDATE_FREQUENCY = 60; // Hz
    public static readonly G = new THREE.Vector3(0, -9.81, 0); // N/kg

    private root: IPhysicElement;
    private timer: any = null;

    constructor() { }

    public setRoot(root: IPhysicElement) {
        this.root = root;
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

    public isColliding(object1: Collidable, object2: Collidable): boolean {
        object1.geometry.computeBoundingBox();
        object2.geometry.computeBoundingBox();
        return object1.geometry.boundingBox.intersectsBox(object2.geometry.boundingBox);
    }

    public getObjectsCollidingWith(collidable: Collidable): Collidable[] {
        const objects = this.getAllPhysicObjects();
        return objects.filter((object: IPhysicElement) =>
            isCollidable(object) && this.isColliding(collidable, object)
        ) as Collidable[];
    }

    public getAllPhysicObjects(): IPhysicElement[] {
        const objects: IPhysicElement[] = [this.root];
        objects.push(...this.getChildren(this.root));
        return objects;
    }

    private getChildren(object: IPhysicElement): IPhysicElement[] {
        const children: IPhysicElement[] = [];
        if (object) {
            children.push(...object.children);
            for (const child of object.children) {
                children.push(...this.getChildren(child));
            }
        }
        return children;
    }

    private updateWorld(deltaTime: Seconds) {
        const objects = this.getAllPhysicObjects();
        objects.forEach((object) => object.update(this, deltaTime));
    }
}
