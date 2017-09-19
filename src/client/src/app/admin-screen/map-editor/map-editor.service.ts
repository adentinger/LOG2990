import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Item } from './item';
import { Vector } from './vector';
import { Path } from './path';

type Line = [Point, Vector];

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

    private calculateAngle(vector1: { x: number, y: number }, vector2: { x: number, y: number }): number {
        const SCALAR_PRODUCT = (vector1.x * vector2.x + vector1.y * vector2.y);
        const PRODUCT_OF_NORM_VECTORS = (Math.sqrt((vector1.x * vector1.x + vector1.y * vector1.y))) *
            (Math.sqrt((vector2.x * vector2.x + vector2.y * vector2.y)));
        const ANGLE = Math.acos(SCALAR_PRODUCT / PRODUCT_OF_NORM_VECTORS);
        return ANGLE;
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
            const VECTOR1 = { x: (POINT2.x - POINT1.x), y: (POINT2.y - POINT1.y) };
            const VECTOR2 = { x: (POINT2.x - POINT3.x), y: (POINT2.y - POINT3.y) };
            const ANGLE = this.calculateAngle(VECTOR1, VECTOR2);
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

    private calculateVector(point1: Point, point2: Point): Vector {
        const VECTOR = new Vector((point2.x - point1.x), (point2.y - point1.y));
        return VECTOR;
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
        if (line1[1].x === 0) {
            const PARAMETRIC_CONSTANT = (line1[0].x - line2[0].x) / line2[1].x;
            const X = line2[0].x + PARAMETRIC_CONSTANT * line2[1].x;
            const Y = line2[0].y + PARAMETRIC_CONSTANT * line2[1].y;
            if (X === line1[0].x && this.isInBetween(line1[0].y, line1[0].y + line1[1].y, Y)) {
                return true;
            }
            return false;
        }
        if (line1[1].y === 0) {
            const PARAMETRIC_CONSTANT = (line1[0].y - line2[0].y) / line2[1].y;
            const X = line2[0].x + PARAMETRIC_CONSTANT * line2[1].x;
            const Y = line2[0].y + PARAMETRIC_CONSTANT * line2[1].y;
            if (this.isInBetween(line1[0].x, line1[0].x + line1[1].x, X) && Y === line1[0].y) {
                return true;
            }
            return false;
        }
        const DENOMINATOR = line2[1].x / line1[1].x - line2[1].y / line1[1].y;

        if (DENOMINATOR !== 0) {
            const NUMERATOR = ((line2[0].y - line1[0].y) / line1[1].y) - ((line2[0].x - line1[0].x) / line1[1].x);

            const PARAMETRIC_CONSTANT = NUMERATOR / DENOMINATOR;
            const X = line2[0].x + PARAMETRIC_CONSTANT * line2[1].x;
            const Y = line2[0].y + PARAMETRIC_CONSTANT * line2[1].y;
            if (this.isInBetween(line1[0].x, line1[0].x + line1[1].x, X) && this.isInBetween(line1[0].y, line1[0].y + line1[1].y, Y)) {
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
            LINES.push([POINTS[i], this.calculateVector(POINTS[i], POINTS[i + 1])]);
        }
        LINES.push([POINTS[POINTS.length - 1], this.calculateVector(POINTS[POINTS.length - 1], POINTS[0])]);

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
        let vector = this.calculateVector(POINTS[0], POINTS[0 + 1]);
        const FIRST_STRETCH = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

        const LENGTH: [number, number] = [0, 0];
        LENGTH[0] += FIRST_STRETCH;
        for (let i = 0; i < this.currentMap.path.points.length - 1; i++) {
            vector = this.calculateVector(POINTS[i], POINTS[i + 1]);
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
