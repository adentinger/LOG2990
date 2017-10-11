import { SerializedItem } from './serialized-item';

export class SerializedPuddle implements SerializedItem {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
