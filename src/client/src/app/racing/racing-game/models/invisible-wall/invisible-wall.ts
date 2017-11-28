import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { COLLISION_EVENT } from '../../physic/utils';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import * as THREE from 'three';
import { Kilograms } from '../../../../types';
import { Line } from '../../../../../../../common/src/math/index';
import { Vector3 } from 'three';
import { Car } from '../car/car';

const SLOW_FACTOR = 0.8;

export class InvisibleWall extends CollidableMesh {

    public readonly mass: Kilograms = Infinity;

    constructor(public readonly length: number) {
        super(new THREE.CubeGeometry( length, 10 , 1 ));
        this.visible = false;
        EventManager.getInstance().registerClass(this, InvisibleWall.prototype);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && collision.target instanceof Car) {
            collision.target.velocity.multiplyScalar(SLOW_FACTOR);
        }
    }

}
