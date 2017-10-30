import * as THREE from 'three';
import { IPhysicElement, isPhysicElement } from './object';
import { Collidable, isCollidable, CollisionInfo } from './collidable';
import { Point, Line, ShoelaceAlgorithm } from '../../../../../../common/src/math';
import { EventManager } from '../../../event-manager.service';
import { Ball } from './examples/ball';

export class PhysicUtils {
    public static readonly G = new THREE.Vector3(0, -9.81, 0); // N/kg
    private static readonly LENGTH_TO_FORCE_CONSTANT = 2; // N/m

    private shoelace: ShoelaceAlgorithm = new ShoelaceAlgorithm();
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

    private getCollision(target: Collidable, source: Collidable): CollisionInfo {
        const UP = new THREE.Vector3(0, 1, 0);
        let collision: CollisionInfo = null;

        if (target === source) {
            return null;
        }

        const targetLines: Line[] = this.getBoundingLines(target);
        const sourceLines: Line[] = this.getBoundingLines(source);

        if (target instanceof Ball) {
            target['point1'].position.set(targetLines[0].origin.x, 1.001, targetLines[0].origin.y);
            target['point2'].position.set(targetLines[1].origin.x, 1.001, targetLines[1].origin.y);
            target['point3'].position.set(targetLines[2].origin.x, 1.001, targetLines[2].origin.y);
        }

        const intersectionPoints: [Line, Line, Point][] = this.getFirstIntersection(targetLines, sourceLines);

        if (intersectionPoints.length < 2) {
            return null;
        }

        const targetLine1 = intersectionPoints[0][0];
        const targetLine2 = intersectionPoints[1][0];
        const sourceLine1 = intersectionPoints[0][1];
        const sourceLine2 = intersectionPoints[1][1];
        const intersection1 = intersectionPoints[0][2];
        const intersection2 = intersectionPoints[1][2];
        const intersectionLine: Line = new Line(intersection1, intersection2);

        const lineVector = this.getVector3FromPoint(intersectionLine.translation);
        const applicationPoint = this.getVector2FromPoint(intersectionLine.interpollate(0.5))
            .sub(this.getVector2FromVector3(target.position));

        const order = lineVector.clone().cross(UP).dot(this.getVector3FromVector2(applicationPoint));
        if (order > 0) {
            lineVector.multiplyScalar(-1);
        }

        const scalarForce = PhysicUtils.LENGTH_TO_FORCE_CONSTANT /
            (applicationPoint.length() / this.getVector2FromPoint(targetLines[0].origin).length());
        if (target instanceof Ball) {
            target['point1'].position.set(targetLine1.origin.x, 1.001, targetLine1.origin.y);
            target['point2'].position.set(targetLine2.origin.x, 1.001, targetLine2.origin.y);
            target['point3'].position.set(targetLine2.destination.x, 1.001, targetLine2.destination.y);
            target['arrow'].position.set(applicationPoint.x + target.position.x, 1.001, applicationPoint.y + target.position.z);
            target['arrow'].setDirection(lineVector.clone().normalize().cross(UP));
        }

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

    private translateBoundingLines(lines: Line[], collidable: Collidable): void {
        this.applyMatrixToLines(lines, this.getTranslationMatrix(this.getVector2FromVector3(collidable.position)));
    }

    private turnBoundingLines(lines: Line[], collidable: Collidable): void {
        this.applyMatrixToLines(lines, this.getRotationMatrix(collidable.rotation.y));
    }

    private applyMatrixToLines(lines: Line[], matrix: THREE.Matrix3): void {
        for (const line of lines) {
            const origin = new THREE.Vector3(line.origin.x, line.origin.y, 1);
            const destination = new THREE.Vector3(line.destination.x, line.destination.y, 1);
            origin.applyMatrix3(matrix);
            destination.applyMatrix3(matrix);
            line.origin.x = origin.x;
            line.origin.y = origin.y;
            line.destination.x = destination.x;
            line.destination.y = destination.y;
        }
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

    private getTranslationMatrix(position: THREE.Vector2): THREE.Matrix3 {
        const translationMatrix = new THREE.Matrix3()
            .set(1, 0, position.x,
                 0, 1, position.y,
                 0, 0, 0);

        return translationMatrix;
    }

    private getRotationMatrix(angle: number): THREE.Matrix3 {
        const rotationMatrix = new THREE.Matrix3()
            .set(Math.cos(angle), -Math.sin(angle), 0,
                 Math.sin(angle),  Math.cos(angle), 0,
                 0, 0, 1);

        return rotationMatrix;
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

