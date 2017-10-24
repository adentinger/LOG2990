import { Map } from './map';
import { Pothole } from './pothole';
import { Item } from './item';
import { Constructor } from '../../../../../common/src/utils';

export class ItemGenerator {

    constructor() { }

    public addItem<ItemGenerated extends Item>(constructor: Constructor<ItemGenerated>, map: Map, itemArray: Item[]): void {
        const MAP_LENGTH = map.computeLength() - map.firstStretchLength();
        let position: number;

        if (itemArray.length === 0) {
            let item: ItemGenerated;
            position = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();
            item = new constructor(position);
            itemArray.push(item);
        }
        else if (itemArray.length < 5) {
            for (let i = 0; i < 2; i++) {
                position = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();
                const item = new constructor(position);
                itemArray.push(item);
            }
        }
        else {
            for (let i = 0; i < itemArray.length; i++) {
                itemArray.pop();
            }
        }
    }

}
