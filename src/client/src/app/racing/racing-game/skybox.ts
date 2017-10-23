import * as THREE from 'three';

export enum SkyboxMode {
    DAY = 0,
    NIGHT,
    NUMBER_OF_MODES
}

export class Skybox extends THREE.Mesh {

    private static cubeNight: THREE.Mesh = Skybox.createCube(SkyboxMode.NIGHT);
    private static cubeDay: THREE.Mesh = Skybox.createCube(SkyboxMode.DAY);

    private modeInternal: SkyboxMode;
    private currentCube: THREE.Mesh;

    constructor(mode: SkyboxMode = SkyboxMode.DAY) {
        super();
        this.mode = mode;
    }

    public get mode(): SkyboxMode {
        return this.modeInternal;
    }

    public set mode(mode: SkyboxMode) {
        let currentCube: THREE.Mesh;
        if (mode === SkyboxMode.DAY) {
            currentCube = Skybox.cubeDay;
        }
        else if (mode === SkyboxMode.NIGHT) {
            currentCube = Skybox.cubeNight;
        }
        else {
            throw new Error('Invalid skybox mode: "' + mode + '"');
        }
        this.remove(this.currentCube);
        this.add(currentCube);
        this.currentCube = currentCube;
        this.modeInternal = mode;
    }

    private static makeShader(texture: THREE.CubeTexture): THREE.ShaderMaterial {
        const SHADER = THREE.ShaderLib['cube'];
        const UNIFORMS = THREE.UniformsUtils.clone(SHADER.uniforms);
        UNIFORMS['tCube'].value = texture;
        const MATERIAL = new THREE.ShaderMaterial({
            fragmentShader: SHADER.fragmentShader,
            vertexShader: SHADER.vertexShader,
            uniforms: UNIFORMS,
            depthWrite: false,
            side: THREE.BackSide
        });
        return MATERIAL;
    }

    private static createCube(mode: SkyboxMode): THREE.Mesh {

        let texture: THREE.CubeTexture;
        const angle = new THREE.Euler( Math.PI / 4, 0, 0, 'XYZ' );

        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/racing/skybox/');

        switch (mode) {
            case SkyboxMode.DAY: // fallthrough
            case SkyboxMode.NIGHT: {
                texture = loader.load(Skybox.findTextures(mode));
                break;
            }
            default: throw new Error('Invalid skybox mode: "' + mode + '"');
        }

        const CUBE =
            new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1),
                           Skybox.makeShader(texture));
            CUBE.setRotationFromEuler(angle);
            CUBE.updateMatrix();
        return CUBE;
    }

    private static findTextures(mode: SkyboxMode): string[] {

        let images: string[];

        switch (mode) {
            case SkyboxMode.DAY: {
                images = ['Day-Right.jpg', 'Day-Left.jpg',
                          'Day-Ceilling.jpg', 'Day-Bottom.jpg',
                          'Day-Front.jpg', 'Day-Back.jpg'];
                break;
            }
            case SkyboxMode.NIGHT: {
                images = ['Night-Right.jpg', 'Night-Left.jpg',
                          'Night-Ceilling.jpg', 'Night-Bottom.jpg',
                          'Night-Front.jpg', 'Night-Back.jpg'];
                break;
            }
        }

        return images;
    }

}
