import * as THREE from 'three';
import { CollidableMesh, CollisionInfo, Collidable } from '../../physic/collidable';
import { Meters } from '../../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT, PhysicUtils } from '../../physic/utils';
import { isDynamicCollidable, DynamicCollidable } from '../../physic/dynamic-collidable';
import { CarPartsLoader } from '../car/car-parts-loader';

export class SpeedBooster extends CollidableMesh {
    private static readonly TEXTURE_URL = '/assets/racing/textures/speed-boost.png';
    private static readonly SIDE: Meters = 1;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly BOOST_SPEED = 40; // m/s
    private static readonly BOOST_PERIOD = 10; // ms
    private static readonly BOOST_INTERVAL = 1000; // ms
    private static readonly TRACK_HEIGHT: Meters = 0.001;
    private static readonly SPEEDBOOSTER_TEXTURE = THREE.ImageUtils.loadTexture(SpeedBooster.TEXTURE_URL);

    public readonly mass = 0;
    private boostedTargets: Set<Collidable> = new Set();

    constructor(eventManager: EventManager) {
        super(new THREE.PlaneGeometry(SpeedBooster.SIDE, SpeedBooster.SIDE)
            .rotateX(SpeedBooster.ORIENTATION_ON_MAP).rotateY(Math.PI));
        const texture = SpeedBooster.SPEEDBOOSTER_TEXTURE;
        CarPartsLoader.CAR_COLORED_PARTS.then((parts: THREE.Mesh[]) => {
            const mesh = new THREE.Mesh();
            mesh.add(...parts);
            const dimension = PhysicUtils.getObjectDimensions(mesh).x;
            this.scale.setScalar(dimension);
        });
        this.material = new THREE.MeshPhongMaterial({ map: texture, specular: 0.2, emissiveIntensity: 0.2, emissive: 0xffffff });
        this.position.y = SpeedBooster.TRACK_HEIGHT;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            if (!this.boostedTargets.has(collision.target)) {
                this.boostedTargets.add(collision.target);
                const state = setInterval(() => {
                    (<DynamicCollidable>collision.target).velocity.setLength(SpeedBooster.BOOST_SPEED);
                }, SpeedBooster.BOOST_PERIOD);
                setTimeout(() => {
                    clearInterval(state);
                    this.boostedTargets.delete(collision.target);
                }, SpeedBooster.BOOST_INTERVAL);
            }
        }
    }
}
