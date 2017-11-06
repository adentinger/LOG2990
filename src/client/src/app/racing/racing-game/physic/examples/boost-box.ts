import { CollidableMesh, CollisionInfo } from '../collidable';
import * as THREE from 'three';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../utils';
import { isDynamicCollidable } from '../dynamic-collidable';

export class BoostBox extends CollidableMesh {
    private static readonly BOOST_FACTOR = 1.09;

    public readonly mass = 0;

    constructor(eventManager: EventManager) {
        super(new THREE.CubeGeometry(1, 1, 1).translate(0, 0.5, 0),
            [null, null, null, new THREE.MeshStandardMaterial({ wireframe: true })]);
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.velocity.multiplyScalar(BoostBox.BOOST_FACTOR);
        }
    }
}
