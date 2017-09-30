import * as THREE from 'three';

export class Skybox extends THREE.Mesh {

    private static textureDay: THREE.CubeTexture = Skybox.createTextureDay();
    private static textureNight: THREE.CubeTexture = Skybox.createTextureNight();
    private mode: string;
    private cube: THREE.Mesh;

    constructor(mode: string) {
        super();
        this.mode = mode;
        this.cube = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1), new THREE.MeshBasicMaterial());
        this.swapMode(mode);
    }

    private static createTextureDay(): THREE.CubeTexture {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('./textures/');
        const day = loader.load(Skybox.findTextures('Day'));
        return day;
    }

    private static createTextureNight(): THREE.CubeTexture {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('./textures/');
        const night = loader.load(Skybox.findTextures('Night'));
        return night;
    }

    private static findTextures(mode: string): string[] {

        let images: string[];

        if (mode === 'Day') {
            images = [];
        }
        else if (mode === 'Night') {
            images = [];
        }

        return images;
    }

    public swapMode(mode: string): void {
        if (mode === 'Day') {
            this.mode = 'Day';
            (this.cube.material as THREE.MeshBasicMaterial).setValues({ envMap: Skybox.textureDay });
        }
        else if (mode === 'Night') {
            this.mode = 'Night';
            (this.cube.material as THREE.MeshBasicMaterial).setValues({ envMap: Skybox.textureNight });
        }
        (this.cube.material as THREE.Material).update();
    }

}
