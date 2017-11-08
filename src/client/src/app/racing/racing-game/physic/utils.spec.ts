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

});
