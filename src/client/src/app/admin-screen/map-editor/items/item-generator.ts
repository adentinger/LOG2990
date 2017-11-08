import { Map } from '../map';
import { Item } from './item';
import { Constructor } from '../../../../../../common/src/utils';
import { Interval } from '../../../../../../common/src/math/interval';
import { Point } from '../../../../../../common/src/math/point';
import { Vector } from '../../../../../../common/src/math/vector';
import { SpeedBoost } from '../speed-boost';

export class ItemGenerator {

    private allPositions: number[];
    private halfSegments: Interval[];

    constructor() {
        this.allPositions = [];
    }

    public addObstacle<ItemGenerated extends Item>(constructor: Constructor<ItemGenerated>, map: Map, itemArray: Item[]): void {
        const MAX_AMOUNT_OF_ITEMS = 5;
        const CURRENT_ARRAY_LENGTH = itemArray.length;

        if (constructor === SpeedBoost) {
            this.generatePositions(map, true);
        }
        else {
            this.generatePositions(map);
        }

        if (CURRENT_ARRAY_LENGTH === 0) {
            const item = new constructor(this.allPositions[CURRENT_ARRAY_LENGTH]);
            itemArray.push(item);
        }
        else if (CURRENT_ARRAY_LENGTH < MAX_AMOUNT_OF_ITEMS) {
            for (let i = 0; i < 2; i++) {
                const item = new constructor(this.allPositions[CURRENT_ARRAY_LENGTH + i]);
                itemArray.push(item);
            }
        }
        else {
            for (let i = 0; i < MAX_AMOUNT_OF_ITEMS; i++) {
                itemArray.pop();
            }
        }
    }

    public generatePositions(map: Map, speedBoost?: boolean): void {
        this.allPositions = [];
        this.halfSegments = map.calucateHalfSegment();

        const MAP_LENGTH = map.computeLength() - map.firstStretchLength();
        const MAX_NUMBER_OF_ITEMS = 5;
        let newPosition: number;

        while (this.allPositions.length < MAX_NUMBER_OF_ITEMS) {
            let isNotUsed = true;
            if (speedBoost === true) {
                const index = Math.round(Math.random() * (this.halfSegments.length - 2) + 1);
                newPosition = Math.round(Math.random() * (this.halfSegments[index].getLength()) + this.halfSegments[index].lower);
            }
            else {
                newPosition = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();
            }

            for (let j = 0; j < this.allPositions.length; j++) {
                if (newPosition === this.allPositions[j] || this.positionIsOnMap(map, newPosition)) {
                    isNotUsed = false;
                }
            }

            if (isNotUsed) {
                this.allPositions.push(newPosition);
            }
        }
    }

    public get positions(): number[] {
        return this.allPositions;
    }

    public randomlyModifyObjectsTypePositions<ItemGenerated extends Item>
    (constructor: Constructor<ItemGenerated>, map: Map, itemArray: Item[]): void {

        const CURRENT_ARRAY_LENGTH = itemArray.length;

        for (let i = 0; i < CURRENT_ARRAY_LENGTH; i++) {
            itemArray.pop();
        }

        if (constructor === SpeedBoost) {
            this.generatePositions(map, true);
        }
        else {
            this.generatePositions(map);
        }

        for (let i = 0; i < CURRENT_ARRAY_LENGTH; i++) {
            itemArray.push(new constructor(this.allPositions[i]));
        }
    }

    public positionIsOnMapObjectsList(itemArray: Item[], position: number) {
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i].position === position) {
                return true;
            }
        }
        return false;
    }

    public positionIsOnMap(map: Map, position: number) {
        return (
            this.positionIsOnMapObjectsList(map.potholes, position) ||
            this.positionIsOnMapObjectsList(map.puddles, position) ||
            this.positionIsOnMapObjectsList(map.speedBoosts, position));
    }

    public itemCoordinates(map: Map, item: Item): Point {
        let point: Point;
        let lastMapCoordinates: Point;
        let vector: Vector;
        const POINTS = map.path.points.slice();
        let length = 0;

        for (let i = 0; i < POINTS.length; i++) {
            vector = Vector.fromPoints(POINTS[i], POINTS[i + 1]);
            if ((length + vector.norm()) > item.position) {
                lastMapCoordinates = POINTS[i];
                break;
            }
            else {
                length += vector.norm();
            }
        }

        const itemPositionMinusLastPointPosition = item.position - length;
        point = new Point(vector.normalized().times(itemPositionMinusLastPointPosition).x,
                        vector.normalized().times(itemPositionMinusLastPointPosition).y);

        point.x += lastMapCoordinates.x;
        point.y += lastMapCoordinates.y;

        return point;
    }
}
