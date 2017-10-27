import * as THREE from 'three';

export class OrthographicCamera extends THREE.OrthographicCamera {

    public static readonly WIDTH: number = window.innerWidth;
    public static readonly HEIGHT: number = window.innerHeight;
    public static readonly ORTHO_HEIGTH = 10;
    public static readonly ASPECT: number = OrthographicCamera.WIDTH / OrthographicCamera.HEIGHT;
    public static readonly NEAR: number = 0.05;
    public static readonly FAR: number = 500;

    private target: THREE.Object3D;

    public constructor() {
        super(
            -OrthographicCamera.ORTHO_HEIGTH / 2 * OrthographicCamera.ASPECT,
            OrthographicCamera.ORTHO_HEIGTH / 2 * OrthographicCamera.ASPECT,
            OrthographicCamera.ORTHO_HEIGTH / 2,
            -OrthographicCamera.ORTHO_HEIGTH / 2,
            OrthographicCamera.NEAR,
            OrthographicCamera.FAR
        );
        this.setupOrthographicView();
    }

    public setTarget(object: THREE.Object3D) {
        object.add(this);
    }

    public setupOrthographicView(): void {
        this.rotation.order = 'YXZ';
        this.position.set(0, 10, 0);
        this.lookAt(new THREE.Vector3);
    }

}
