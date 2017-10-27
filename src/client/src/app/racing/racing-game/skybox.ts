import * as THREE from 'three';
import { PhysicMesh } from './physic/object';

export enum SkyboxMode {
    DAY = 0,
    NIGHT,
    NUMBER_OF_MODES
}

export class Skybox extends PhysicMesh {

    private static cubeNight: PhysicMesh = Skybox.createCube(SkyboxMode.NIGHT);
    private static cubeDay: PhysicMesh = Skybox.createCube(SkyboxMode.DAY);

    private static intensityDay = 1;
    private static intensityNight = 0.25;

    private static directionDay = new THREE.Vector3(1, -1, 0).normalize();
    private static directionNight = new THREE.Vector3(1, -1, -1).normalize();

    private modeInternal: SkyboxMode;
    private currentCube: PhysicMesh;

    public readonly AMBIANT: THREE.AmbientLight;
    public readonly DIRECTIONAL: THREE.HemisphereLight;

    constructor(mode: SkyboxMode = SkyboxMode.DAY) {
        super();
        this.AMBIANT = new THREE.AmbientLight(0xfafafa, Skybox.intensityDay);
        this.AMBIANT.castShadow = true;
        this.DIRECTIONAL = new THREE.HemisphereLight(0xfafacc, 0x80ff00, Skybox.intensityDay);
        this.DIRECTIONAL.lookAt(Skybox.directionDay);
        this.DIRECTIONAL.castShadow = true;

        this.mode = mode;
    }

    public get mode(): SkyboxMode {
        return this.modeInternal;
    }

    public set mode(mode: SkyboxMode) {
        let currentCube: PhysicMesh;
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
        this.DIRECTIONAL.intensity = mode === SkyboxMode.DAY ? Skybox.intensityDay : Skybox.intensityNight;
        this.AMBIANT.intensity = Skybox.intensityNight;
        this.DIRECTIONAL.lookAt(mode === SkyboxMode.DAY ? Skybox.directionDay : Skybox.directionNight);
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

    private static createCube(mode: SkyboxMode): PhysicMesh {

        let texture: THREE.CubeTexture;

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
            new (class extends PhysicMesh {})(new THREE.CubeGeometry(500, 500, 500, 1, 1, 1),
                           Skybox.makeShader(texture));

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
