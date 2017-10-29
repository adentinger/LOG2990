import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode-manager';

export class Skybox extends THREE.Mesh implements DayModeNotifiable {

    private static cubeNight: THREE.Mesh = Skybox.createCube(DayMode.NIGHT);
    private static cubeDay: THREE.Mesh = Skybox.createCube(DayMode.DAY);

    private currentCube: THREE.Mesh;

    constructor() {
        super();
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

    private static createCube(mode: DayMode): THREE.Mesh {

        let texture: THREE.CubeTexture;

        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/racing/skybox/');

        switch (mode) {
            case DayMode.DAY: // fallthrough
            case DayMode.NIGHT: {
                texture = loader.load(Skybox.findTextures(mode));
                break;
            }
            default: throw new Error('Invalid skybox mode: "' + mode + '"');
        }

        const CUBE =
            new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 1, 1, 1),
                           Skybox.makeShader(texture));

        return CUBE;
    }

    private static findTextures(mode: DayMode): string[] {

        let images: string[];

        switch (mode) {
            case DayMode.DAY: {
                images = ['Day-Right.jpg', 'Day-Left.jpg',
                          'Day-Ceilling.jpg', 'Day-Bottom.jpg',
                          'Day-Front.jpg', 'Day-Back.jpg'];
                break;
            }
            case DayMode.NIGHT: {
                images = ['Night-Right.jpg', 'Night-Left.jpg',
                          'Night-Ceilling.jpg', 'Night-Bottom.jpg',
                          'Night-Front.jpg', 'Night-Back.jpg'];
                break;
            }
        }

        return images;
    }

    public dayModeChanged(newMode: DayMode) {
        let currentCube: THREE.Mesh;
        if (newMode === DayMode.DAY) {
            currentCube = Skybox.cubeDay;
        }
        else if (newMode === DayMode.NIGHT) {
            currentCube = Skybox.cubeNight;
        }
        else {
            throw new Error('Invalid skybox mode: "' + newMode + '"');
        }
        this.remove(this.currentCube);
        this.add(currentCube);
        this.currentCube = currentCube;
    }

}