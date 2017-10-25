import * as THREE from 'three';
import { PhysicEngine } from './engine';
import { Seconds } from '../../types';

export interface IPhysicElement extends THREE.Object3D {
    position: THREE.Vector3;
    rotation: THREE.Euler;

    readonly children: IPhysicElement[];

    update(engine: PhysicEngine, deltaTime: Seconds): void;
}

export abstract class PhysicMesh extends THREE.Mesh implements IPhysicElement {
    public update(engine: PhysicEngine, deltaTime: Seconds) { }
}

export declare interface PhysicMesh extends THREE.Mesh, IPhysicElement {
    readonly children: IPhysicElement[];
    add(...object: IPhysicElement[]): void;
    remove(object: IPhysicElement): void;

    traverse(callback: (object: IPhysicElement) => any): void;
    traverseVisible(callback: (object: IPhysicElement) => any): void;
    traverseAncestors(callback: (object: IPhysicElement) => any): void;

    getChildByName(name: string): IPhysicElement;
    translate(distance: number, axis: THREE.Vector3): IPhysicElement;
}
