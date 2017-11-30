import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { COLLISION_EVENT } from '../../physic/utils';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import * as THREE from 'three';
import { Kilograms, Meters } from '../../../../types';
import { Line } from '../../../../../../../common/src/math/index';
import { Vector3 } from 'three';
import { Car } from '../car/car';

const SLOW_FACTOR = 0.8;

export class InvisibleWall extends CollidableMesh {
    public static readonly WALL_HEIGHT: Meters = 10.0;
    public static readonly WALL_DEPTH: Meters = 1.0;

    public readonly mass: Kilograms = Infinity;

    constructor(public readonly length: number) {
        super(new THREE.CubeGeometry( length, InvisibleWall.WALL_HEIGHT , InvisibleWall.WALL_DEPTH )
            .translate(0, InvisibleWall.WALL_HEIGHT / 2, 0));
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
