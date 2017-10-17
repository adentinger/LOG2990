import * as THREE from 'three';

export class Skybox extends THREE.Mesh {

    private static textureNight: THREE.ShaderMaterial = Skybox.createShaderMaterial('Night');
    private static textureDay: THREE.ShaderMaterial = Skybox.createShaderMaterial('Day');
    private modeInternal: string;

    public cube: THREE.Mesh;

    constructor(mode: string) {
        super();
        this.modeInternal = mode;
        this.cube = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1), new THREE.ShaderMaterial());
        this.add(this.cube);
        this.mode = mode;
    }

    private static findTextures(mode: string): string[] {

        let images: string[];

        if (mode === 'Day') {
            images = ['Day-Right.jpg', 'Day-Left.jpg',
                'Day-Ceilling.jpg', 'Day-Bottom.jpg',
                'Day-Front.jpg', 'Day-Back.jpg'];
        }
        else if (mode === 'Night') {
            images = ['Night-Right.jpg', 'Night-Left.jpg',
                'Night-Ceilling.jpg', 'Night-Bottom.jpg',
                'Night-Front.jpg', 'Night-Back.jpg'];
        }

        return images;
    }

    public get mode(): string {
        return this.modeInternal;
    }

    public set mode(mode: string) {
        if (mode === 'Day') {
            this.modeInternal = mode;
            (this.cube.material as THREE.ShaderMaterial) = (Skybox.textureDay);
        }
        else if (mode === 'Night') {
            this.modeInternal = mode;
            (this.cube.material as THREE.ShaderMaterial) = (Skybox.textureNight);
        }
        else {
            throw new Error('Invalid skybox mode: "' + mode + '"');
        }
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

}
