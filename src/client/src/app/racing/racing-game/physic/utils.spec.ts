import { TestBed, inject } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { PhysicUtils } from './utils';
import { Collidable } from './collidable';

import * as THREE from 'three';
import { EventManager } from '../../../event-manager.service';
import { PhysicMesh } from './object';
import { Kilograms } from '../../types';

let eventManager: EventManager;
let physicUtils: PhysicUtils;

describe('Physic utils', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EventManager
            ]
        });
        eventManager = new EventManager();
        physicUtils = new PhysicUtils(eventManager);
    });

    it('should be created', () => {
        expect(PhysicUtils).toBeTruthy();
    });

    it('should returns non-negative values for object dimensions', () => {
        const dummyObject = new THREE.Object3D();
        const dimensionsMesured: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject);
        expect(dimensionsMesured.x >= 0);
        expect(dimensionsMesured.y >= 0);
        expect(dimensionsMesured.z >= 0);
    });

    it('should return bigger dimension values for bigger objects. Yeah you read that right', () => {
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

    it('should properly set root', () => {
        const dummyObject = new THREE.Object3D();
        dummyObject.name = 'Franky';
        physicUtils.setRoot(dummyObject);
        expect(physicUtils['root'].name === 'Franky');
    });
});
