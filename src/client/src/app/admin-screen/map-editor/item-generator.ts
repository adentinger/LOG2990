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
        const MAX_NUMBER_OF_ITEMS = 15;
        let newPosition: number;

        while (this.allPositions.length < MAX_NUMBER_OF_ITEMS) {
            let isNotUsed = true;
            newPosition = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();

            for (let j = 0; j < this.allPositions.length; j++) {
                if (newPosition === this.allPositions[j]) {
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
        const itemArrayCurrentLength = itemArray.length;
        let newPosition: number;
        const MAP_LENGTH = map.computeLength() - map.firstStretchLength();

        for (let i = 0; i < itemArrayCurrentLength; i++) {
            itemArray.pop();
        }

        while (allPositions.length < itemArrayCurrentLength) {
            let isNotUsed = true;
            newPosition = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();

            for (let j = 0; j < allPositions.length; j++) {
                if (newPosition === allPositions[j]) {
                    isNotUsed = false;
                }
            }

            if (isNotUsed) {
                allPositions.push(new constructor(newPosition));
            }
        }

        for (let k = 0; k < allPositions.length; k++) {
            itemArray.push(allPositions[k]);
        }
    }
}
