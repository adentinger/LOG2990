import * as THREE from 'three';
import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../types';
import { EventManager } from '../../../../event-manager.service';
import { COLLISION_EVENT } from '../../physic/utils';
import { isDynamicCollidable, DynamicCollidable } from '../../physic/dynamic-collidable';
import { PhysicUtils } from '../../physic/utils';
import { Car } from '../car/car';
import { AFTER_PHYSIC_UPDATE_EVENT } from '../../physic/engine';
import { PerspectiveCamera } from '../../rendering/perspective-camera';

export class Pothole extends CollidableMesh {
    private static readonly RADIUS: number = 1;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;
    private static readonly SLIP_FACTOR = Math.PI;
    private static readonly CAMERA_NAME = 'racing-camera';
    private static readonly FREQUENCY_SCALING_FACTOR = 1000; // ms / s
    private static readonly ROTATION_FREQUENCY = 3; // Hz
    private static readonly POTHOLE_TEXTURE = THREE.ImageUtils.loadTexture('/assets/racing/pothole2.png');
    private static readonly MIN_SPEED = 10; // m/s

    private static readonly SLOW_FACTOR = 0.90;
    private static readonly TRACK_HEIGHT = 0.015;
    public static readonly mass = 0;

    private readonly car: Car;
    private targetsToMakeNormal: DynamicCollidable[] = [];
    private targetsToShake: DynamicCollidable[] = [];

    constructor(eventManager: EventManager) {
        super(new THREE.CircleGeometry(Pothole.RADIUS, Pothole.SEGMENTS));
        this.car = new Car(new THREE.Color('green'));
        this.car.waitToLoad.then(() => {
            const scale = this.car.dimensions.x;
            this.geometry.scale(scale, scale, scale);
         });
        const texture = Pothole.POTHOLE_TEXTURE;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(2, 2);
        texture.offset.set(-0.5, -0.5);
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = Pothole.ORIENTATION_ON_MAP;
        this.position.y = Pothole.TRACK_HEIGHT;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            const index = this.targetsToMakeNormal.findIndex((target) => target === collision.target);
            if (index !== -1) {
                this.targetsToMakeNormal.splice(index, 1);
            }
            this.targetsToShake.push(collision.target);
            if (collision.target.velocity.length() > Pothole.MIN_SPEED) {
                collision.target.velocity.multiplyScalar(Pothole.SLOW_FACTOR);
            }
        }
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    private onCameraAvailable(event: EventManager.Event<void>) {
        this.targetsToMakeNormal.forEach((target) => {
            const camera = target.getObjectByName(Pothole.CAMERA_NAME) as THREE.Camera;
            if (camera) {
                camera.lookAt(PerspectiveCamera.LOOK_AT_POSITION);
            }
        });
        this.targetsToMakeNormal.splice(0);
        this.targetsToShake.forEach((target) => {
            const camera = target.getObjectByName(Pothole.CAMERA_NAME) as THREE.Camera;
            if (camera) {
                this.shakeCamera(camera);
            }
        });
        this.targetsToMakeNormal.push(...this.targetsToShake);
        this.targetsToShake.splice(0);
    }

    public shakeCamera(camera: THREE.Camera) {
        camera.rotation.x = Math.PI / 12 * Math.sin(
            2 * Math.PI * Date.now() / Pothole.FREQUENCY_SCALING_FACTOR * Pothole.ROTATION_FREQUENCY);
    }
}
