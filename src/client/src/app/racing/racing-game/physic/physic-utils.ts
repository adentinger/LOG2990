import * as THREE from 'three';
import { IPhysicElement, isPhysicElement } from './object';
import { Collidable, isCollidable, CollisionInfo } from './collidable';
import { Point, Line } from '../../../../../../common/src/math';
import { EventManager } from '../../../event-manager.service';

export class PhysicUtils {
    public static readonly G = new THREE.Vector3(0, -9.81, 0); // N/kg

    private root: THREE.Object3D;

    constructor(private eventManager: EventManager) { }

    public setRoot(root: THREE.Object3D) {
        this.root = root;
    }

    public checkColliding(object1: Collidable, object2: Collidable): boolean {
        const boundingBox1 = new THREE.Box3().setFromObject(object1);
        const boundingBox2 = new THREE.Box3().setFromObject(object2);
        return boundingBox1.intersectsBox(boundingBox2);
    }

    public getObjectsCollidingWith(collidable: Collidable): Collidable[] {
        const objects = this.getAllPhysicObjects();
        return objects.filter((object: IPhysicElement) =>
            object !== collidable && isCollidable(object) && this.checkColliding(collidable, object)
        ) as Collidable[];
    }

    public getCollisionsOf(target: Collidable): CollisionInfo[] {
        const collisions: CollisionInfo[] = [];
        const collidables: Collidable[] = this.getAllPhysicObjects()
            .filter((object) => isCollidable(object)) as Collidable[];
        let collision: CollisionInfo;
        for (const collidable of collidables) {
            collision = {
                target,
                source: collidable,
                positions: this.getCollision(target, collidable)
            };
            if (collision.positions.length > 0) {
                collisions.push(collision);
            }
        }

        return collisions;
    }

    public getAllPhysicObjects(): IPhysicElement[] {
        const objects: THREE.Object3D[] = [this.root];
        objects.push(...this.getChildren(this.root));
        return objects.filter((child) => isPhysicElement(child)) as IPhysicElement[];
    }

    private getCollision(target: Collidable, source: Collidable): Point[] {
        const positions: Point[] = [];

        const targetLines: Line[] = this.getBoundingLines(target);
        const sourceLines: Line[] = this.getBoundingLines(source);



        return positions;
    }

    private getBoundingLines(collidable: Collidable): Line[] {
        const targetLines: Line[] = [];

        collidable.geometry.computeBoundingBox();
        const box1 = collidable.geometry.boundingBox;

        // Corners in counter clockwise order (positive rotation)
        const corners: Point[] = [
            new Point(box1.min.x, box1.min.y),
            new Point(box1.max.x, box1.min.y),
            new Point(box1.max.x, box1.max.y),
            new Point(box1.min.x, box1.max.y)
        ];
        for (let i = 0; i < corners.length; ++i) {
            targetLines.push(new Line(corners[i], corners[(i + 1) % corners.length]));
        }

        return targetLines;
    }

    private turnBoundingLines(lines: Line[], collidable: Collidable): void {
        for (const line of lines) {
        }
    }

    private getRotationMatrixAroundPoint(angle: number, point: THREE.Vector2): THREE.Matrix3 {
        return null;
    }

    private getChildren(object: THREE.Object3D): THREE.Object3D[] {
        const children: THREE.Object3D[] = [];
        if (object) {
            children.push(...object.children);
            for (const child of object.children) {
                children.push(...this.getChildren(child));
            }
        }
        return children;
    }
}

