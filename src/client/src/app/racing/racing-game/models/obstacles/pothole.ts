import * as THREE from 'three';
import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../../physic/utils';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';


export class Pothole extends CollidableMesh {
    private static readonly RADIUS: Meters = 1;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly BOOST_FACTOR = 1.09;
    public readonly mass = 0;

    constructor(eventManager: EventManager) {
        super(new THREE.CircleGeometry(Pothole.RADIUS, Pothole.SEGMENTS));
        const texture = THREE.ImageUtils.loadTexture('../assets/racing/obstacles/pothole.jpg');
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = Pothole.ORIENTATION_ON_MAP;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.velocity.multiplyScalar(Pothole.BOOST_FACTOR);
        }
    }
}
