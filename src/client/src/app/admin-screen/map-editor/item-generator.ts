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

        if (itemArray.length === 0) {
            const item = new constructor(this.allPositions[itemArray.length]);
            itemArray.push(item);
        }
        else if (itemArray.length < MAX_AMOUNT_OF_ITEMS) {
            for (let i = 0; i < 2; i++) {
                const item = new constructor(this.allPositions[itemArray.length + i]);
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
}
