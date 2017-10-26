import { Injectable } from '@angular/core';
import { IPhysicElement, isPhysicElement } from './object';
import { Collidable, CollidableMesh } from './collidable';
import * as THREE from 'three';
import { Seconds } from '../../types';

@Injectable()
export class PhysicEngine {
    public static readonly UPDATE_FREQUENCY = 100; // Hz
    public static readonly G = new THREE.Vector3(0, -9.81, 0); // N/kg

    private root: THREE.Object3D;
    private timer: any = null;

    constructor() { }

    public setRoot(root: THREE.Object3D) {
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
        const boundingBox1 = new THREE.Box3().setFromObject(object1);
        const boundingBox2 = new THREE.Box3().setFromObject(object2);
        return boundingBox1.intersectsBox(boundingBox2);
    }

    public getObjectsCollidingWith(collidable: Collidable): Collidable[] {
        const objects = this.getAllPhysicObjects();
        return objects.filter((object: IPhysicElement) =>
            object !== collidable && object instanceof CollidableMesh && this.isColliding(collidable, object)
        ) as Collidable[];
    }

    public getAllPhysicObjects(): IPhysicElement[] {
        const objects: THREE.Object3D[] = [this.root];
        objects.push(...this.getChildren(this.root));
        return objects.filter((child) => isPhysicElement(child)) as IPhysicElement[];
    }

    private getChildren(object: THREE.Object3D): THREE.Object3D[] {
        const children: THREE.Object3D[] = [];
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
