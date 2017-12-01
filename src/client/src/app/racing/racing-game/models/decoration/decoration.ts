import * as THREE from 'three';

import { Loader } from '../loader';

export abstract class Decoration extends THREE.Mesh {

    protected static readonly loader = new Loader();

    public readonly isDecoration: true;

    protected addParts(parts: THREE.Mesh[]): void {
        const clonedParts = parts.map(part => {
            return part.clone();
        });
        clonedParts.forEach(part => part.material = (part.material as THREE.Material).clone());
        this.add(... clonedParts);
    }

}
