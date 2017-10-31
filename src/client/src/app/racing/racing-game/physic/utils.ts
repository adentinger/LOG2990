import * as THREE from 'three';
import { IPhysicElement, isPhysicElement } from './object';
import { Collidable, isCollidable, CollisionInfo } from './collidable';
import { Point, Line } from '../../../../../../common/src/math';

const UP = new THREE.Vector3(0, 1, 0);

export class PhysicUtils {
    public static readonly G = new THREE.Vector3(0, -9.81, 0); // N/kg
    private static readonly LENGTH_TO_FORCE_CONSTANT = 0.75; // N/m^2

    private root: THREE.Object3D;

    constructor() { }

    public setRoot(root: THREE.Object3D) {
        this.root = root;
    }

    public applyCollisionsTo(target: Collidable): boolean {
        let hasCollided = false;
        const collidables: Collidable[] = this.getAllPhysicObjects()
            .filter((object) => object !== target && isCollidable(object)) as Collidable[];
        for (const collidable of collidables) {
            const collisionOccured = this.applyCollision(target, collidable);
            hasCollided = hasCollided || collisionOccured;
        }
        return hasCollided;
    }

    public getCollisionsOf(target: Collidable): CollisionInfo[] {
        const collisions: CollisionInfo[] = [];
        const collidables: Collidable[] = this.getAllPhysicObjects()
            .filter((object) => isCollidable(object)) as Collidable[];
        let collision: CollisionInfo;
        for (const collidable of collidables) {
            collision = this.getCollision(target, collidable);
            if (collision != null) {
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

    private applyCollision(target: Collidable, source: Collidable): boolean {
        let collisionOccured = false;

        const targetLines: Line[] = this.getBoundingLines(target);
        const sourceLines: Line[] = this.getBoundingLines(source);

        const intersectionPoints: [Line, Line, Point][] = this.getFirstIntersection(targetLines, sourceLines);
        let applicationPoint: THREE.Vector2;

        if (intersectionPoints.length >= 2) {
            collisionOccured = true;
            const intersection1 = intersectionPoints[0][2];
            const intersection2 = intersectionPoints[1][2];
            const intersectionLine: Line = new Line(intersection1, intersection2);

            applicationPoint = this.getVector2FromPoint(intersectionLine.interpollate(0.5))
                .sub(this.getVector2FromVector3(target.position));

            // const lineVector = this.getVector3FromPoint(intersectionLine.translation);
        }

        return collisionOccured;
    }

    private getCollision(target: Collidable, source: Collidable): CollisionInfo {
        let collision: CollisionInfo = null;

        if (target === source) {
            return null;
        }

        const targetLines: Line[] = this.getBoundingLines(target);
        const sourceLines: Line[] = this.getBoundingLines(source);

        const intersectionPoints: [Line, Line, Point][] = this.getFirstIntersection(targetLines, sourceLines);

        if (intersectionPoints.length < 2) {
            return null;
        }

        const intersection1 = intersectionPoints[0][2];
        const intersection2 = intersectionPoints[1][2];
        const intersectionLine: Line = new Line(intersection1, intersection2);

        const lineVector = this.getVector3FromPoint(intersectionLine.translation);
        const applicationPoint = this.getVector2FromPoint(intersectionLine.interpollate(0.5))
            .sub(this.getVector2FromVector3(target.position));

        const order = lineVector.clone().cross(UP).dot(this.getVector3FromVector2(applicationPoint));
        if (order > 0) {
            lineVector.negate();
        }

        const scalarForce = PhysicUtils.LENGTH_TO_FORCE_CONSTANT /
            ((applicationPoint.length() / this.getVector2FromPoint(targetLines[0].origin).length()) ** 2);

        const force: THREE.Vector2 = this.getVector2FromVector3(
            lineVector.normalize().cross(UP).multiplyScalar(scalarForce)
        );

        collision = {
            target,
            source,
            applicationPoint,
            force
        };

        return collision;
    }

    private getFirstIntersection(targetLines: Line[], sourceLines: Line[]): [Line, Line, Point][] {
        const intersections: [Line, Line, Point][] = [];
        for (const targetLine of targetLines) {
            for (const sourceLine of sourceLines) {
                const intersectionPoints = targetLine.intersectsWith(sourceLine);

                if (intersectionPoints.length > 0) {
                    intersections.push(...intersectionPoints.map(point =>
                        [targetLine, sourceLine, point] as [Line, Line, Point]));
                    // intersections.push([targetLine, sourceLine, intersectionPoints[0]]);
                }
            }

            if (intersections.length >= 2) { // We need 2 intersections to compute the collision.
                break;
            }
        }

        return intersections;
    }

    private getBoundingLines(collidable: Collidable): Line[] {
        const targetLines: Line[] = [];

        collidable.geometry.computeBoundingBox();
        const box1 = collidable.geometry.boundingBox;

        // Corners in counter clockwise order (positive rotation)
        const corners: Point[] = [
            new Point(box1.min.x, box1.min.z),
            new Point(box1.max.x, box1.min.z),
            new Point(box1.max.x, box1.max.z),
            new Point(box1.min.x, box1.max.z)
        ];

        // Make positions relative to the world
        for (const corner of corners) {
            const vector = new THREE.Vector3(corner.x, 0, corner.y);
            vector.applyEuler(collidable.rotation);
            corner.x = vector.x + collidable.position.x;
            corner.y = vector.z + collidable.position.z;
        }

        for (let i = 0; i < corners.length; ++i) {
            targetLines.push(new Line(corners[i].clone(), corners[(i + 1) % corners.length].clone()));
        }

        return targetLines;
    }

    private getVector2FromVector3(vector: THREE.Vector3): THREE.Vector2 {
        return new THREE.Vector2(vector.x, vector.z);
    }

    private getVector2FromPoint(point: Point): THREE.Vector2 {
        return new THREE.Vector2(point.x, point.y);
    }

    private getVector3FromVector2(vector: THREE.Vector2): THREE.Vector3 {
        return new THREE.Vector3(vector.x, 0, vector.y);
    }

    private getVector3FromPoint(point: Point): THREE.Vector3 {
        return new THREE.Vector3(point.x, 0, point.y);
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

