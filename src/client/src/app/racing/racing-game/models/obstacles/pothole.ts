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
    private static readonly TEXTURE_URL = '/assets/racing/textures/pothole.png';
    private static readonly RADIUS: number = 0.5;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;
    private static readonly SLIP_FACTOR = Math.PI;
    private static readonly FREQUENCY_SCALING_FACTOR = 1000; // ms / s
    private static readonly ROTATION_FREQUENCY = 3; // Hz
    private static readonly POTHOLE_TEXTURE = THREE.ImageUtils.loadTexture(Pothole.TEXTURE_URL);
    private static readonly MIN_SPEED = 10; // m/s

    private static readonly SLOW_FACTOR = 0.98;
    private static readonly SHAKE_AMPLITUDE = Math.PI / 240;
    private static readonly TRACK_HEIGHT = 0.015;
    private static readonly SIZE_TO_CAR_PROPORTION = 0.25;
    public readonly mass = 0;

    private readonly car: Car;
    private targetsToMakeNormal: DynamicCollidable[] = [];
    private targetsToShake: DynamicCollidable[] = [];

    constructor(eventManager: EventManager) {
        super(new THREE.CircleGeometry(Pothole.RADIUS, Pothole.SEGMENTS),
              new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));
        this.car = new Car(new THREE.Color('green'));
        const texturedPlane = new THREE.Mesh();
        this.car.waitToLoad.then(() => {
            const scale = this.car.dimensions.x * Pothole.SIZE_TO_CAR_PROPORTION;
            const meshScale = scale / Pothole.SIZE_TO_CAR_PROPORTION / Pothole.RADIUS;
            this.geometry.scale(meshScale, meshScale, meshScale);
            texturedPlane.geometry = new THREE.CircleGeometry(scale);
         });
        const texture = Pothole.POTHOLE_TEXTURE;
        texturedPlane.material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, specular: 0 });
        texturedPlane.position.set(0, Pothole.TRACK_HEIGHT, 0);
        this.add(texturedPlane);
        this.rotation.x = Pothole.ORIENTATION_ON_MAP;
        this.position.set(0, Pothole.TRACK_HEIGHT, 0);
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
            const camera = target.getObjectByName(PerspectiveCamera.CAMERA_NAME) as THREE.Camera;
            if (camera) {
                camera.lookAt(PerspectiveCamera.LOOK_AT_POSITION);
            }
        });
        this.targetsToMakeNormal.splice(0);
        this.targetsToShake.forEach((target) => {
            const camera = target.getObjectByName(PerspectiveCamera.CAMERA_NAME) as THREE.Camera;
            if (camera) {
                this.shakeCamera(camera, target);
            }
        });
        this.targetsToMakeNormal.push(...this.targetsToShake);
        this.targetsToShake.splice(0);
    }

    public shakeCamera(camera: THREE.Camera, target: DynamicCollidable) {
        camera.rotation.x = target.velocity.length() * Pothole.SHAKE_AMPLITUDE * Math.sin(
            2 * Math.PI * Date.now() / Pothole.FREQUENCY_SCALING_FACTOR * Pothole.ROTATION_FREQUENCY);
    }
}
