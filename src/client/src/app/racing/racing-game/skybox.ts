import * as THREE from 'three';

export class Skybox extends THREE.Mesh {

    private static textureDayPromise: Promise<THREE.CubeTexture> = new Promise((resolve: Function, reject: (error: any) => void) => {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/racing/skybox/');
        const day = loader.load(Skybox.findTextures('Day'), (texture: THREE.CubeTexture) => {
            resolve(texture);
        }, () => {}, reject);
    }).then((texture: THREE.CubeTexture) => {
        Skybox.textureDay = texture;
        return texture;
    });

    private static textureNight: THREE.CubeTexture = null;
    private static textureDay: THREE.CubeTexture = null;
    public daySkybox = new THREE.Mesh;
    private mode: string;
    public cube: THREE.Mesh;

    constructor(mode: string) {
        super();
        this.mode = mode;
        this.cube = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1), new THREE.MeshBasicMaterial());
        this.add(this.cube);
        this.swapMode(mode);
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
            images = ['Day-Left.jpg', 'Day-Right.jpg',
                'Day-Back.jpg', 'Day-Front.jpg',
                'Day-Ceilling.jpg', 'Day-Bottom.jpg'];
        }
        else if (mode === 'Night') {
            images = ['Day-Left.jpg', 'Day-Right.jpg',
                'Day-Back.jpg', '.Day-Front.jpg',
                'Day-Ceilling.jpg', '.Day-Bottom.jpg'];
        }

        return images;
    }

    private static setShaders(texture: THREE.CubeTexture): THREE.ShaderMaterial {
        const SHADER = THREE.ShaderLib['cube'];
        SHADER.uniforms['tCube'].value = texture;
        const MATERIAL = new THREE.ShaderMaterial({
            fragmentShader: SHADER.fragmentShader,
            vertexShader: SHADER.vertexShader,
            uniforms: SHADER.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        return MATERIAL;
    }

    public swapMode(mode: string): void {
        if (mode === 'Day') {
            this.mode = 'Day';
            if (Skybox.textureDay === null) {
                Skybox.textureDayPromise.then((texture: THREE.CubeTexture) => {
                    if (this.mode === 'Day') {
                        (this.cube.material as THREE.MeshBasicMaterial).setValues({ envMap: Skybox.textureDay });
                    }
                });
            }
            else {
                (this.cube.material as THREE.MeshBasicMaterial).setValues({ envMap: Skybox.textureDay });
            }
        }
        else if (mode === 'Night') {
            this.mode = 'Night';
            (this.cube.material as THREE.MeshBasicMaterial).setValues({ envMap: Skybox.textureNight });
        }
        (this.cube.material as THREE.Material).update();
    }

}
