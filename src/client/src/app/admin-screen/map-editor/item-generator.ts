import { Map } from './map';
import { Item } from './item';
import { Constructor } from '../../../../../common/src/utils';

export class ItemGenerator {

    private allPositions: number[];

    constructor() {
        this.allPositions = [];
    }

    public addObstacle<ItemGenerated extends Item>(constructor: Constructor<ItemGenerated>, map: Map, itemArray: Item[]): void {
        const MAX_AMOUNT_OF_ITEMS = 5;
        const currentArrayLength = itemArray.length;
        this.generatePositions(map);

        if (currentArrayLength === 0) {
            const item = new constructor(this.allPositions[currentArrayLength]);
            itemArray.push(item);
        }
        else if (currentArrayLength < MAX_AMOUNT_OF_ITEMS) {
            for (let i = 0; i < 2; i++) {
                const item = new constructor(this.allPositions[currentArrayLength + i]);
                itemArray.push(item);
            }
        }
        else {
            for (let i = 0; i < MAX_AMOUNT_OF_ITEMS; i++) {
                itemArray.pop();
            }
        }
    }

    public generatePositions(map: Map): void {
        this.allPositions = [];

        const MAP_LENGTH = map.computeLength() - map.firstStretchLength();
        const MAX_NUMBER_OF_ITEMS = 5;
        let newPosition: number;

        while (this.allPositions.length < MAX_NUMBER_OF_ITEMS) {
            let isNotUsed = true;
            newPosition = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();

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
        const allPositions = [];
        let newPosition: number;
        const MAP_LENGTH = map.computeLength() - map.firstStretchLength();
        const itemArrayCopy = itemArray.slice();

        for (let i = 0; i < itemArrayCopy.length; i++) {
            itemArray.pop();
        }

        for (let i = 0; i < itemArrayCopy.length; i++) {
            let isNotUsed = true;
            newPosition = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();

            if (newPosition === itemArrayCopy[i].position && allPositions.includes(newPosition)) {
                isNotUsed = false;
            }

            if (isNotUsed) {
                itemArray.push(new constructor(newPosition));
            }
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
        if (
            this.positionIsOnMapObjectsList(map.potholes, position) ||
            this.positionIsOnMapObjectsList(map.puddles, position) ||
            this.positionIsOnMapObjectsList(map.speedBoosts, position)) {

            return true;
        }
        return false;
    }
}
