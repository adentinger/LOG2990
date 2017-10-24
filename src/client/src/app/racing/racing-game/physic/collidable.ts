import { IPhysicObject } from './physic-object';

export interface Collidable extends IPhysicObject {
    geometry: THREE.Geometry;
}
