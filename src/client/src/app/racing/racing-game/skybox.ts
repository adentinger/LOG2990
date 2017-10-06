import * as THREE from 'three';

export class Skybox extends THREE.Mesh {
/*
    private static textureDayPromise: Promise<THREE.ShaderMaterial> = new Promise((resolve: Function, reject: (error: any) => void) => {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/racing/skybox/');
        const day = loader.load(Skybox.findTextures('Day'), (material: THREE.CubeTexture) => {
            resolve(material);
        }, () => { }, reject);
    }).then((material: THREE.CubeTexture) => {
        Skybox.textureDay = Skybox.setShaders(material);
        return Skybox.textureDay;
    });

    private static textureNightPromise: Promise<THREE.ShaderMaterial> = new Promise((resolve: Function, reject: (error: any) => void) => {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/racing/skybox/');
        const night = loader.load(Skybox.findTextures('Night'), (material: THREE.CubeTexture) => {
            resolve(material);
        }, () => { }, reject);
    }).then((material: THREE.CubeTexture) => {
        Skybox.textureDay = Skybox.setShaders(material);
        return Skybox.textureDay;
    });
*/
    private static textureNight: THREE.ShaderMaterial = Skybox.createShaderMaterial('Night');
    private static textureDay: THREE.ShaderMaterial = Skybox.createShaderMaterial('Day');

    private mode: string;
    public cube: THREE.Mesh;

    constructor(mode: string) {
        super();
        this.mode = mode;
        this.cube = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1), new THREE.ShaderMaterial());
        this.add(this.cube);
        this.swapMode(mode);
    }

    private static findTextures(mode: string): string[] {

        let images: string[];

        if (mode === 'Day') {
            /*images = ['Day-Right.jpg', 'Day-Left.jpg',
                'Day-Ceilling.jpg', 'Day-Bottom.jpg',
                'Day-Front.jpg', 'Day-Back.jpg'];
                */
                images = ['Night-Right.jpg', 'Night-Left.jpg',
                'Night-Ceilling.jpg', 'Night-Bottom.jpg',
                'Night-Front.jpg', 'Night-Back.jpg'];
        }
        else if (mode === 'Night') {
            images = ['Night-Right.jpg', 'Night-Left.jpg',
                'Night-Ceilling.jpg', 'Night-Bottom.jpg',
                'Night-Front.jpg', 'Night-Back.jpg'];
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

    private static createShaderMaterial(mode: string): THREE.ShaderMaterial {

        let texture: THREE.CubeTexture;

        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/racing/skybox/');

        if (mode === 'Day') {
            texture = loader.load(Skybox.findTextures('Day'));
        }
        else {
            texture = loader.load(Skybox.findTextures('Night'));
        }

        return Skybox.setShaders(texture);
    }

    public swapMode(mode: string): void {
        if (mode === 'Day') {
            this.mode = 'Day';
            (this.cube.material as THREE.ShaderMaterial).setValues(Skybox.textureDay);
        }/*
        else if (mode === 'Night') {
            this.mode = 'Night';
            if (Skybox.textureNight === null) {
                Skybox.textureNightPromise.then((material: THREE.ShaderMaterial) => {
                    if (this.mode === 'Night') {
                        (this.cube.material as THREE.ShaderMaterial).setValues(Skybox.textureNight);
                    }
                });
            }
            else {
                (this.cube.material as THREE.Material).update();
            }
        }*/
    }


}
