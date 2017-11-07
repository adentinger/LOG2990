import * as THREE from 'three';
import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../../physic/utils';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import { Car } from '../car/car';


export enum SlipDirection {
    RIGHT = -1,
    LEFT = 1
}

export class Puddle extends CollidableMesh {
    private static readonly RADIUS: Meters = 3;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly SLIP_FACTOR = Math.PI;
    private static readonly PUDDLE_TEXTURE = THREE.ImageUtils.loadTexture('/assets/racing/puddle.jpg');
    private readonly car: Car;

    public readonly mass = 0;

    constructor(eventManager: EventManager, private slipDirection: SlipDirection) {
        super(new THREE.CircleGeometry(Puddle.RADIUS, Puddle.SEGMENTS));
        this.car = new Car(new THREE.Color('green'));
        this.car.waitToLoad.then(() => {this.scale.setScalar(Math.sqrt(this.car.dimensions.x * this.car.dimensions.z / Math.PI)); });
        const texture = Puddle.PUDDLE_TEXTURE;
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = Puddle.ORIENTATION_ON_MAP;
        this.position.y = 0.01;
        eventManager.registerClass(this);

    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.angularVelocity.set(0, Puddle.SLIP_FACTOR * this.slipDirection *
                Math.sin(2 * Math.PI * Date.now() / 10 * 2), 0);
        }
    }
}
