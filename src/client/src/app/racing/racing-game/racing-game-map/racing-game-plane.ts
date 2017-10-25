import * as THREE from 'three';
import { Track } from '../../track';
import { Meters, Seconds } from '../../types';
import { IPhysicElement } from '../physic/object';
import { PhysicEngine } from '../physic/engine';
import { CollidableMesh } from '../physic/collidable';

export class RacingGamePlane extends CollidableMesh {
    public readonly children: IPhysicElement[];
    public readonly velocity = new THREE.Vector3();

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX, 100, 100);
        const texture = THREE.ImageUtils.loadTexture('/assets/racing/textures/grass.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(500, 500);
        this.material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        this.rotateX(Math.PI / 2);
    }
}
