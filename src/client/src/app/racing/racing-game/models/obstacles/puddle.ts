import * as THREE from 'three';
import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT, PhysicUtils } from '../../physic/utils';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import { CarPartsLoader } from '../car/car-parts-loader';


export enum SlipDirection {
    RIGHT = -1,
    LEFT = 1
}

export class Puddle extends CollidableMesh {
    private static readonly TEXTURE_URL = '/assets/racing/textures/puddle.jpg';
    private static readonly RADIUS: Meters = 1;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly SLIP_FACTOR = Math.PI * 3;
    private static readonly PUDDLE_TEXTURE = THREE.ImageUtils.loadTexture(Puddle.TEXTURE_URL);
    private static readonly SLIP_FREQUENCY = 1; // Hz
    private static readonly TRACK_HEIGHT: Meters = 0.001;
    private static readonly FREQUENCY_SCALING_FACTOR = 1000; // ms / s

    public readonly mass = 0;

    constructor(eventManager: EventManager, private slipDirection: SlipDirection) {
        super(new THREE.CircleGeometry(Puddle.RADIUS, Puddle.SEGMENTS));
        CarPartsLoader.CAR_COLORED_PARTS.then((parts: THREE.Mesh[]) => {
            const mesh = new THREE.Mesh();
            mesh.add(...parts);
            const dimensions = PhysicUtils.getObjectDimensions(mesh);
            const scale = Math.sqrt((dimensions.x * dimensions.z) / Math.PI);
            this.scale.setScalar(scale);
        });
        const texture = Puddle.PUDDLE_TEXTURE;
        this.material = new THREE.MeshPhongMaterial({ map: texture, specular: 0 });
        this.rotation.x = Puddle.ORIENTATION_ON_MAP;
        this.position.y = Puddle.TRACK_HEIGHT;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.angularVelocity.set(0, Puddle.SLIP_FACTOR * this.slipDirection *
                Math.sin(2 * Math.PI * Date.now() / Puddle.FREQUENCY_SCALING_FACTOR * Puddle.SLIP_FREQUENCY), 0);
        }
    }
}
