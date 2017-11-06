import * as THREE from 'three';
import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../../physic/utils';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';


export enum SlipDirection {
    RIGHT = -1,
    LEFT = 1
}

export class Puddle extends CollidableMesh {
    private static readonly RADIUS: Meters = 3;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly SLIP_FACTOR = Math.PI;

    public readonly mass = 0;

    constructor(eventManager: EventManager, private slipDirection: SlipDirection) {
        super(new THREE.CircleGeometry(Puddle.RADIUS, Puddle.SEGMENTS));
        const texture = THREE.ImageUtils.loadTexture('../assets/racing/obstacles/puddle.jpg');
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = Puddle.ORIENTATION_ON_MAP;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.angularVelocity.set(0, Puddle.SLIP_FACTOR * this.slipDirection *
                Math.sin(2 * Math.PI * Date.now() / 1000 * 2), 0);
        }
    }
}
