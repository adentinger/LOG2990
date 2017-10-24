import * as THREE from 'three';

import { ObjMtlLoader } from '../three-utils/obj-mtl-loader';


export enum CarColor {
    RED = 0,
    YELLOW,
    GREEN,
    BLUE
}

export class Car extends THREE.Group {

    private static readonly OBJ_MTL_LOADER: ObjMtlLoader
        = new ObjMtlLoader('/assets/racing/car_model/');

    constructor(carNumber: CarColor) {
        super();
        Car.OBJ_MTL_LOADER.load(
            'Low-Poly-Racing-Car.obj',
            'Low-Poly-Racing-Car.mtl'
        ).then((car) => {
            this.children = car.children;
        }).catch(() => {});
    }

}
