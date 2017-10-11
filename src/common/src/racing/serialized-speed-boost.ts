import { SerializedItem } from './serialized-item';

export class SerializedSpeedBoost implements SerializedItem {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
