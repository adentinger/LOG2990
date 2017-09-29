import { Skybox } from './skybox';
import * as THREE from 'three';

export class RacingGame {

    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    private floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 20, 20), new THREE.MeshBasicMaterial({ wireframe: true }));
    private renderer = new THREE.WebGLRenderer({ antialias: true });
    private animationRequestId = 0;

    private mouseX = 0;
    private mouseY = 0;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5;

    constructor() { }

    public initialise(): void {

        this.camera.position.set(0, 500, 1000);
        this.camera.lookAt(this.scene.position);

        const FLOOR = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 20, 20), new THREE.MeshBasicMaterial({
            wireframe: true
        }));

        const SKYBOX = new Skybox('Day');

        this.scene.add(this.camera);
        this.scene.add(FLOOR);
        this.scene.add(SKYBOX);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private render(): void {
        this.animationRequestId = requestAnimationFrame(() => {
            this.renderer.render(this.scene, this.camera);
            this.render();
        });
    }

    public onMouseMove(e) {
        this.mouseX = (e.clientX - this.windowHalfX) * 10;
        this.mouseY = (e.clientY - this.windowHalfY) * 10;
    }

    public mapRenderer() {
        requestAnimationFrame(this.render);
        this.camera.position.x += (this.mouseX - this.camera.position.x) * .02;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * .02;
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}
