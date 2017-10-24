import { PhysicEngine } from './physic-engine';

export interface IPhysicObject extends THREE.Object3D {
    update: (engine: PhysicEngine, deltaTime: number) => void;
    children: IPhysicObject[];
}
