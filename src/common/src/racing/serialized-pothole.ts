import { SerializedItem } from './serialized-item';

export class SerializedPothole implements SerializedItem {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
