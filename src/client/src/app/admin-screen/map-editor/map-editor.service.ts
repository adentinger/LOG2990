import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Item } from './item';
import { Vector } from './vector';

type Line = [Point, Vector];

@Injectable()
export class MapEditorService {

    private currentMap: Map;
    constructor() { }

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
    }

    private calculateAngle(vector1: { x: number, y: number }, vector2: { x: number, y: number }): number {
        const scalarProduct = (vector1.x * vector2.x + vector1.y * vector2.y);
        const productOfNormOfVectors = (Math.sqrt((vector1.x * vector1.x + vector1.y * vector1.y))) *
            (Math.sqrt((vector2.x * vector2.x + vector2.y * vector2.y)));
        const angle = Math.acos(scalarProduct / productOfNormOfVectors);
        return angle;
    }

    public checkAngles(): Array<[Point, Point, Point]> {
        const MIN_ANGLE = Math.PI / 4;
        const points = [];
        points.push.apply(points, this.currentMap.path.points);
        points.push(points[0], points[1]);
        const badAngles: Array<[Point, Point, Point]> = [];
        for (let i = 0; i < points.length - 2; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];
            const point3 = points[i + 2];
            const vector1 = { x: (point2.x - point1.x), y: (point2.y - point1.y) };
            const vector2 = { x: (point2.x - point3.x), y: (point2.y - point3.y) };
            const angle = this.calculateAngle(vector1, vector2);
            if (Math.abs(angle) < MIN_ANGLE) {
                badAngles.push([point1, point2, point3]);
            }
        }
        return badAngles;
    }

    public checkPathLoopBack(): boolean {
        let finished = false;

        if (this.currentMap.path.points.length >= 3) {
            finished = true;
        }

        return finished;
    }

    private calculateVector(point1: Point, point2: Point): Vector {
        const vector = new Vector((point2.x - point1.x), (point2.y - point1.y));
        return vector;
    }

    private isInBetween(value1: number, value2: number, valueInBetween: number): boolean {
        console.log(value1, value2);
        if (value1 > value2) {
            console.log('je me suis rendu ici 1');
            if (value1 > valueInBetween && value2 < valueInBetween) {
                console.log('je me suis rendu ici 2');
                return true;
            }
        }
        else {
            console.log('je me suis rendu ici 4');
            if (value1 < valueInBetween && value2 > valueInBetween) {
                console.log('je me suis rendu ici 3');
                return true;
            }
        }
        return false;
    }

    private checkTwoLinesCross(line1: Line, line2: Line): boolean {
        console.log(line1, line2);
        if (line1[1].x === 0) {
            const parametricConstant = (line1[0].x - line2[0].x) / line2[1].x;
            const x = line2[0].x + parametricConstant * line2[1].x;
            if (this.isInBetween(line1[0].x, line1[0].x + line1[1].x, x)) {
                return true;
            }
            return false;
        }
        if (line1[1].y === 0) {
            const parametricConstant = (line1[0].y - line2[0].y) / line2[1].y;
            const y = line2[0].y + parametricConstant * line2[1].y;
            if (this.isInBetween(line1[0].y, line1[0].y + line1[1].y, y)) {
                return true;
            }
            return false;
        }
        const denominator = line2[1].y / line1[1].y - line2[1].x / line1[1].x;
        if (denominator !== 0) {
            const numerator = ((line2[0].y - line1[0].y) / line1[1].y) - ((line2[0].x - line1[0].x) / line1[1].x);
            const parametricConstant = numerator / denominator;
            const x = line2[0].x + parametricConstant * line2[1].x;
            const y = line2[0].y + parametricConstant * line2[1].y;
            console.log(x, y, 'allo');
            if (this.isInBetween(line1[0].x, line1[0].x + line1[1].x, x) && this.isInBetween(line1[0].y, line1[0].y + line1[1].y, y)) {
                return true;
            }
        }
        return false;
    }

    public checkLinesCross(): Array<[Line, Line]> {
        const points = this.currentMap.path.points;
        const linesThatCross: Array<[Line, Line]> = [];
        const lines: Array<Line> = [];
        for (let i = 0; i < points.length - 1; i++) {
            lines.push([points[i], this.calculateVector(points[i], points[i + 1])]);
        }
        lines.push([points[points.length - 1], this.calculateVector(points[points.length - 1], points[0])]);

        for (let i = 0; i < lines.length - 1; i++) {
            for (let j = i + 2; j < lines.length - i; j++) {
                if (this.checkTwoLinesCross(lines[i], lines[j])) {
                    linesThatCross.push([lines[i], lines[j]]);
                }
            }
        }

        return linesThatCross;
    }

    public pushPoint(point: Point): void {
        this.currentMap.path.points.push(point);
    }

    public popPoint(): void {
        this.currentMap.path.points.pop();
    }

    public editPoint(): void {
    }

    public addItem(item: Item): boolean {
        return false;
    }
}
