import * as THREE from 'three';

import { Loader } from '../loader';

export abstract class Decoration extends THREE.Mesh {

    private static readonly SHININESS = 10;

    protected static readonly loader = new Loader();

    public readonly isDecoration: true;

    protected addParts(parts: THREE.Mesh[]): void {
        const clonedParts = parts.map(part => {
            return part.clone();
        });
        clonedParts.forEach(part => {
            part.material = (part.material as THREE.Material).clone();
            part.geometry.computeVertexNormals();
            part.geometry['computeMorphNormals']();
            (part.material as THREE.MeshPhongMaterial).blending = THREE.NoBlending;
            (part.material as THREE.MeshPhongMaterial).shininess = Decoration.SHININESS;
            (part.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
            part.receiveShadow = true;
            part.castShadow = true;
        });
        this.add(... clonedParts);
    }

}
