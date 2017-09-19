import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Item } from './item';
import { Vector } from './vector';
import { Line } from './line';
import { Path } from './path';

@Injectable()
export class MapEditorService {

    private currentMap: Map;

    constructor() {
        this.newMap();
    }

    public newMap(): boolean {
        let mapCreated = false;

        this.deleteMap();

        this.currentMap = new Map();
        if (this.currentMap !== null) {
            mapCreated = true;
        }

        return mapCreated;
    }

    public saveMap(): Promise<boolean> {
        return Promise.reject(false);
    }

    public deleteMap(): void {
        this.currentMap = null;
    }

    public get points(): Point[] {
        return this.currentMap.path.points;
    }

    public checkAngles(): Array<[Point, Point, Point]> {
        const MIN_ANGLE = Math.PI / 4;
        const POINTS = [];
        POINTS.push.apply(POINTS, this.currentMap.path.points);
        POINTS.push(POINTS[0], POINTS[1]);

        const BAD_ANGLES: Array<[Point, Point, Point]> = [];
        for (let i = 0; i < POINTS.length - 2; i++) {
            const POINT1 = POINTS[i];
            const POINT2 = POINTS[i + 1];
            const POINT3 = POINTS[i + 2];
            const VECTOR1 = Vector.fromPoints(POINT1, POINT2);
            const VECTOR2 = Vector.fromPoints(POINT3, POINT2);
            const ANGLE = VECTOR1.angleTo(VECTOR2);
            if (Math.abs(ANGLE) < MIN_ANGLE) {
                BAD_ANGLES.push([POINT1, POINT2, POINT3]);
            }
        }
        return BAD_ANGLES;
    }

    public checkPathLoopBack(): boolean {
        let finished = false;

        if (this.currentMap.path.points.length >= 3) {
            finished = true;
        }

        return finished;
    }

    private isInBetween(value1: number, value2: number, valueInBetween: number): boolean {
        if (value1 > value2) {
            if (value1 > valueInBetween && value2 < valueInBetween) {
                return true;
            }
        }
        else {
            if (value1 < valueInBetween && value2 > valueInBetween) {
                return true;
            }
        }
        return false;
    }

    private checkTwoLinesCross(line1: Line, line2: Line): boolean {
        if (line1.translation.x === 0) {
            const PARAMETRIC_CONSTANT = (line1.origin.x - line2.origin.x) / line2.translation.x;
            const X = line2.origin.x + PARAMETRIC_CONSTANT * line2.translation.x;
            const Y = line2.origin.y + PARAMETRIC_CONSTANT * line2.translation.y;
            if (X === line1.origin.x && this.isInBetween(line1.origin.y, line1.origin.y + line1.translation.y, Y)) {
                return true;
            }
            return false;
        }
        if (line1.translation.y === 0) {
            const PARAMETRIC_CONSTANT = (line1.origin.y - line2.origin.y) / line2.translation.y;
            const X = line2.origin.x + PARAMETRIC_CONSTANT * line2.translation.x;
            const Y = line2.origin.y + PARAMETRIC_CONSTANT * line2.translation.y;
            if (this.isInBetween(line1.origin.x, line1.origin.x + line1.translation.x, X) && Y === line1.origin.y) {
                return true;
            }
            return false;
        }
        const DENOMINATOR = line2.translation.x / line1.translation.x - line2.translation.y / line1.translation.y;

        if (DENOMINATOR !== 0) {
            const NUMERATOR =   ((line2.origin.y - line1.origin.y) / line1.translation.y)
                              - ((line2.origin.x - line1.origin.x) / line1.translation.x);

            const PARAMETRIC_CONSTANT = NUMERATOR / DENOMINATOR;
            const X = line2.origin.x + PARAMETRIC_CONSTANT * line2.translation.x;
            const Y = line2.origin.y + PARAMETRIC_CONSTANT * line2.translation.y;
            if (   this.isInBetween(line1.origin.x, line1.origin.x + line1.translation.x, X)
                && this.isInBetween(line1.origin.y, line1.origin.y + line1.translation.y, Y)) {
                return true;
            }
        }
        return false;
    }

    public checkLinesCross(): Array<[Line, Line]> {
        const POINTS = this.currentMap.path.points;
        const LINES_THAT_CROSS: Array<[Line, Line]> = [];
        const LINES: Array<Line> = [];
        for (let i = 0; i < POINTS.length - 1; i++) {
            LINES.push(new Line(POINTS[i], POINTS[i + 1]));
        }
        LINES.push(new Line(POINTS[POINTS.length - 1], POINTS[0]));

        for (let i = 0; i < LINES.length - 1; i++) {
            for (let j = i + 2; j < LINES.length - i; j++) {
                if (this.checkTwoLinesCross(LINES[i], LINES[j])) {
                    LINES_THAT_CROSS.push([LINES[i], LINES[j]]);
                }
            }
        }

        return LINES_THAT_CROSS;
    }

    public pushPoint(point: Point): void {
        if (point.x < this.currentMap.width && point.y < this.currentMap.height && point.x > 0 && point.y > 0) {
            this.currentMap.path.points.push(point);
        }
    }

    public popPoint(): Point {
        return this.currentMap.path.points.pop();
    }

    public editPoint(index: number, x: number, y: number): void {
        if (x < this.currentMap.width && y < this.currentMap.height && x > 0 && y > 0) {
            this.currentMap.path.points[index].x = x;
            this.currentMap.path.points[index].y = y;
        }
    }

    private findMapLength(): [number, number] {
        const POINTS = this.currentMap.path.points;
        let vector = Vector.fromPoints(POINTS[0], POINTS[0 + 1]);
        const FIRST_STRETCH = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

        const LENGTH: [number, number] = [0, 0];
        LENGTH[0] += FIRST_STRETCH;
        for (let i = 0; i < this.currentMap.path.points.length - 1; i++) {
            vector = Vector.fromPoints(POINTS[i], POINTS[i + 1]);
            LENGTH[1] += Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        }
        return LENGTH;
    }

    public addItem(item: Item): void {
        const MAP_LENGTH = this.findMapLength();
        if (item.type === 'puddle' && MAP_LENGTH[0] < item.position && item.position < MAP_LENGTH[1]) {
            this.currentMap.puddles.push(item);
        }
        else if (item.type === 'pothole' && MAP_LENGTH[0] < item.position && item.position < MAP_LENGTH[1]) {
            this.currentMap.potholes.push(item);
        }
        else if (item.type === 'speedBoost' && item.position < MAP_LENGTH[1]) {
            this.currentMap.speedBoosts.push(item);
        }
    }

    public getPath(): Path {
        return this.currentMap.path;
    }
}
