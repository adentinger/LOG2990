import * as THREE from 'three';
import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../../physic/utils';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import { Car } from '../car/car';

export class SpeedBooster extends CollidableMesh {
    private static readonly RADIUS: Meters = 2;
    private static readonly SEGMENTS: number = 4;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly BOOST_FACTOR = 1.09;
    private static readonly SPEEDBOOSTER_TEXTURE = THREE.ImageUtils.loadTexture('/assets/racing/speed-boost.png');
    public readonly mass = 0;
    private readonly car: Car;

    constructor(eventManager: EventManager) {
        super(new THREE.CircleGeometry(SpeedBooster.RADIUS, SpeedBooster.SEGMENTS));
        const texture = SpeedBooster.SPEEDBOOSTER_TEXTURE;
        this.car = new Car(new THREE.Color('green'));
        this.car.waitToLoad.then(() => {this.scale.setScalar(2 * this.car.dimensions.x); });
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = SpeedBooster.ORIENTATION_ON_MAP;
        this.position.y = 0.01;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.velocity.multiplyScalar(SpeedBooster.BOOST_FACTOR);
        }
    }
}
