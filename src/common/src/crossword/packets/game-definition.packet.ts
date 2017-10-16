import { Definition } from '../definition';

export class GameDefinitionPacket {
    constructor(
        public index: number,
        public definition: Definition) { }
}
