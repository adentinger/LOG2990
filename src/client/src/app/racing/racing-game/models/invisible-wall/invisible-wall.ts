import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { COLLISION_EVENT } from '../../physic/utils';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import * as THREE from 'three';
import { Kilograms } from '../../../../types';

const SLOW_FACTOR = 0.2;

export class InvisibleWall extends CollidableMesh {

    public readonly mass: Kilograms = Infinity;

    constructor(public readonly length: number) {
        super(new THREE.PlaneGeometry( length, 10 , 10 ));
        this.material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide});
        // this.visible = false;
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.velocity.multiplyScalar(SLOW_FACTOR);
        }
    }

}
