import * as THREE from 'three';

export abstract class Decoration extends THREE.Mesh {
    public readonly isDecoration: true;
}
