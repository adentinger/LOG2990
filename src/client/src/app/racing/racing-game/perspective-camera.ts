import * as THREE from 'three';

export class PerspectiveCamera extends THREE.PerspectiveCamera {

    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ASPECT: number = PerspectiveCamera.WIDTH / PerspectiveCamera.HEIGHT;
    private static readonly NEAR: number = 0.05;
    private static readonly FAR: number = 300;
    private static readonly VIEW_ANGLE: number = 45;

    private target: THREE.Object3D;

    public constructor() {
        super(
            PerspectiveCamera.VIEW_ANGLE,
            PerspectiveCamera.ASPECT,
            PerspectiveCamera.NEAR,
            PerspectiveCamera.FAR
        );
        this.setupPerspectiveView();
    }

    public setTarget(object: THREE.Object3D) {
        object.add(this);
    }

    public setupPerspectiveView(): void {
        this.rotation.order = 'YXZ';
        this.position.set(0, 10, 30);
        this.rotation.set(0, 0, 0);
        this.lookAt(new THREE.Vector3(0, 0, 0));
    }

}
