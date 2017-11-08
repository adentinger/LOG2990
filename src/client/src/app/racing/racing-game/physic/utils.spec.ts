import { TestBed, inject } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { PhysicUtils } from './utils';

import * as THREE from 'three';
import { EventManager } from '../../../event-manager.service';

describe('Physic utils', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EventManager
            ]
        });
    });

    let service: PhysicUtils;

    beforeEach(() => {
        service = new PhysicUtils(new EventManager());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('returns non-negative values for object dimensions', () => {
        const dummyObject = new THREE.Object3D();
        const dimensionsMesured: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject);
        expect(dimensionsMesured.x >= 0);
        expect(dimensionsMesured.y >= 0);
        expect(dimensionsMesured.z >= 0);
    });

    it('return bigger dimension values for bigger objects. Yeah you read that right', () => {
        const dummyObject1 = new THREE.Object3D();
        const dummyObject2 = new THREE.Object3D();

        const scaleUp = new THREE.Matrix4();
        scaleUp.scale(new THREE.Vector3(3, 3, 3));
        const scaleWayUp = new THREE.Matrix4();
        scaleUp.scale(new THREE.Vector3(8, 9, 7));

        dummyObject1.applyMatrix(scaleUp);
        dummyObject2.applyMatrix(scaleWayUp);
        const dimensionsObject1: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject1);
        const dimensionsObject2: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject2);
        expect(dimensionsObject1.x < dimensionsObject2.x);
        expect(dimensionsObject1.y < dimensionsObject2.y);
        expect(dimensionsObject1.z < dimensionsObject2.z);
    });
});
