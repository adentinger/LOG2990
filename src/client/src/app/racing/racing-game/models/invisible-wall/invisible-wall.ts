import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { COLLISION_EVENT } from '../../physic/utils';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import * as THREE from 'three';
import { Kilograms } from '../../../../types';
import { Line } from '../../../../../../../common/src/math/index';
import { Vector3 } from 'three';

const SLOW_FACTOR = 0.2;

export class InvisibleWall extends CollidableMesh {

    public readonly mass: Kilograms = Infinity;

    constructor(public readonly length: number, line: Line) {
        super(new THREE.PlaneGeometry( length, 10 , 10 ));
        this.material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe: true});
        const middlePoint = line.interpolate(0.25);
        this.position.set(middlePoint.x, this.position.y, middlePoint.y);
        // this.visible = false;
    }

    public ajustPosition(ajustment: number): void {
        const newLength = this.length + ajustment;
        const scale = newLength / this.length;
        this.geometry.scale(this.length * scale, 10 * scale, 10 * scale);
        this.position.subScalar(ajustment);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.velocity.multiplyScalar(SLOW_FACTOR);
        }
    }

}
