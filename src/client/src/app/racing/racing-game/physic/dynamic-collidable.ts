import * as THREE from 'three';
import { PhysicUtils } from './engine';
import { Seconds, Kilograms } from '../../types';
import { DynamicPhysicMesh, DynamicPhysicElement } from './dynamic-object';
import { Collidable, CollisionInfo } from './collidable';

export interface DynamicCollidable extends DynamicPhysicElement, Collidable {
    velocity: THREE.Vector3; // m/s
}

export abstract class DynamicCollidableMesh extends DynamicPhysicMesh implements DynamicCollidable {

    public geometry: THREE.Geometry;
    public mass: Kilograms = 1;
    public velocity: THREE.Vector3 = new THREE.Vector3(0);
    protected arrow: THREE.ArrowHelper = new THREE.ArrowHelper(new THREE.Vector3(), this.position);
    protected point1: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0x0000ff}));
    protected point2: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0xff7f00}));
    protected point3: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0xff00ff}));

    public update(utils: PhysicUtils, deltaTime: Seconds): void {
        const forceDirections = this.getCollisions(utils, deltaTime);
        forceDirections.forEach(([position, force]) => {
            const torque = position.clone().cross(force);
            const r = position.length();
            const momentOfInertia = (r ** 2) * this.mass; // I = r^2 * m

            const acceleration = force.clone().divideScalar(this.mass); // F = m*a  =>  a = F/m
            const angularAcceleration = torque.clone().divideScalar(momentOfInertia); // ­tau = I*alpha  =>  alpha = tau/I

            this.velocity.addScaledVector(acceleration, deltaTime);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);
        });

        super.update(utils, deltaTime);
    }

    protected getCollisions(utils: PhysicUtils, deltaTime: Seconds) {
        const collidingObjects: CollisionInfo[] = utils.getCollisionsOf(this);
        if (collidingObjects.length > 0) {
            // console.log('Collision', this.position, collidingObjects);
        }
        return collidingObjects.map((collision: CollisionInfo) => {
            return <[THREE.Vector3, THREE.Vector3]>[
                this.getVector3From(collision.applicationPoint),
                this.getVector3From(collision.force)
            ];
        });
    }

    private getVector3From(vector: THREE.Vector2): THREE.Vector3 {
        return new THREE.Vector3(vector.x, 0, vector.y);
    }
}
