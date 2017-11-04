import { CollidableMesh, CollisionInfo } from '../collidable';
import * as THREE from 'three';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../utils';
import { isDynamicCollidable } from '../dynamic-collidable';

export enum SlipDirection {
    RIGHT = -1,
    LEFT = 1
}

export class PuddleBox extends CollidableMesh {
    private static readonly SLIP_FACTOR = Math.PI;

    public readonly mass = 0;

    constructor(eventManager: EventManager, private slipDirection: SlipDirection) {
        super(new THREE.CubeGeometry(2, 1, 2).translate(0, 0.5, 0),
            [null, null, null, new THREE.MeshStandardMaterial({wireframe: true})]);
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.angularVelocity.set(0, PuddleBox.SLIP_FACTOR * this.slipDirection *
                Math.sin(2 * Math.PI * Date.now() / 1000 * 2), 0);
        }
    }
}
