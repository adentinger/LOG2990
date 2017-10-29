import * as THREE from 'three';

export class RotationUtils {

    public static vector3FromRotation(x: number,
                                      y: number,
                                      z: number,
                                      order: string = 'YXZ'): THREE.Vector3 {
        const EULER = new THREE.Euler(x, y, z, order);
        const VECTOR = new THREE.Vector3(0, 0, -1);
        return VECTOR.applyEuler(EULER);
    }

}
