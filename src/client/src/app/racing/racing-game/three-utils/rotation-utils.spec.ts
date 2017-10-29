import * as THREE from 'three';
import { RotationUtils } from './rotation-utils';


describe('RotationUtils', () => {

    it('should rotate a vector using a Euler transformation', () => {
        const INPUTS = [
            {x: 0, y: 0, z: 0, order: 'YXZ', expected: new THREE.Vector3(0, 0, -1)},
            {x: Math.PI, y: 0, z: 0, order: 'YXZ', expected: new THREE.Vector3(0, 0, 1)},
            {x: 0, y: 0, z: Math.PI, order: 'YXZ', expected: new THREE.Vector3(0, 0, -1)},
            {x: Math.PI / 2, y: Math.PI / 2, z: 0, order: 'YXZ', expected: new THREE.Vector3(0, 1, 0)},
            {x: Math.PI / 2, y: Math.PI / 2, z: 0, order: 'XYZ', expected: new THREE.Vector3(-1, 0, 0)}
        ];
        INPUTS.forEach((input) => {
            const RETURNED = RotationUtils.vector3FromRotation(input.x, input.y, input.z, input.order);
            expect(RETURNED.x).toBeCloseTo(input.expected.x);
            expect(RETURNED.y).toBeCloseTo(input.expected.y);
            expect(RETURNED.z).toBeCloseTo(input.expected.z);
        });
    });

});
