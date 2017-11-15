import * as THREE from 'three';
import { EventManager } from '../../../event-manager.service';
import { BEFORE_PHYSIC_UPDATE_EVENT, AFTER_PHYSIC_UPDATE_EVENT } from '../physic/engine';
import { SoundListener } from '../sound/sound-listener';

export class PerspectiveCamera extends THREE.PerspectiveCamera implements SoundListener {
    public static readonly DRIVER_POSITION = new THREE.Vector3(-0.25, 1.15, -0.1);
    public static readonly DEFAULT_POSITION = new THREE.Vector3(0, 2, 5);
    public static readonly LOOK_AT_POSITION = new THREE.Vector3(0, 1.3, -3);

    public static readonly CAMERA_NAME = 'racing-camera';

    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ASPECT: number = PerspectiveCamera.WIDTH / PerspectiveCamera.HEIGHT;
    private static readonly NEAR: number = 0.05;
    private static readonly FAR: number = 300;
    private static readonly VIEW_ANGLE: number = 45;

    private target: THREE.Object3D;
    public readonly name: string;
    public readonly listener: THREE.AudioListener;

    public constructor(eventManager: EventManager) {
        super(
            PerspectiveCamera.VIEW_ANGLE,
            PerspectiveCamera.ASPECT,
            PerspectiveCamera.NEAR,
            PerspectiveCamera.FAR
        );
        this.setupPerspectiveView();
        eventManager.registerClass(this);
        this.name = PerspectiveCamera.CAMERA_NAME;
        this.listener = new THREE.AudioListener();
    }

    public setTarget(object: THREE.Object3D) {
        if (this.target != null) {
            this.target.remove(this);
        }
        object.add(this);
        this.target = object;
    }

    public setupPerspectiveView(): void {
        this.rotation.order = 'YXZ';
        this.position.copy(PerspectiveCamera.DEFAULT_POSITION);
        this.rotation.set(0, 0, 0);
        this.lookAt(PerspectiveCamera.LOOK_AT_POSITION);
    }

    @EventManager.Listener(BEFORE_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onBeforeUpdate(event: EventManager.Event<void>) {
        this.target.remove(this);
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onAfterUpdate(event: EventManager.Event<void>) {
        this.target.add(this);
    }

}
