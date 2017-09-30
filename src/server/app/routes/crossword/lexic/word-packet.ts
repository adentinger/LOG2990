import { Packet } from '../../../../../common/communication/packet';
import { WordConstraint } from './word-constraint';
import { CharConstraint } from './char-constraint';

// Example of an implementation of a Packet for the class WorkConstraint
export class WordPacket extends Packet<WordConstraint> {

    constructor(value: WordConstraint) {
        super(value);
    }

    public serialize(): Buffer {
        const DATA: Buffer = Buffer.alloc(4 + 4 + 1 + this.value.charConstraints.length * (1 + 4) );
        DATA.writeUInt32LE(this.value.minLength, 0);
        DATA.writeUInt32LE(this.value.maxLength, 4);
        DATA.writeUInt8(+this.value.isCommon, 8);
        let charConstraint: CharConstraint;
        for (let i = 0; i < this.value.charConstraints.length; ++i) {
            charConstraint = this.value.charConstraints[i];
            DATA.writeUInt8(charConstraint.char.charCodeAt(0), 9 + 5 * i);
            DATA.writeUInt32LE(charConstraint.position, 9 + 5 * i + 1);
        }
        return DATA;
    }

    public parse(data: Buffer): WordConstraint {
        let minLength: number,
            maxLength: number,
            isCommon: boolean,
            // tslint:disable-next-line:prefer-const
            charConstraints: CharConstraint[] = [];
        minLength = data.readInt32LE(0);
        maxLength = data.readInt32LE(4);
        isCommon = data.readUInt8(8) !== 0;
        for (let i = 9; i < data.byteLength; i += 5) {
            const charConstraint: CharConstraint = {
                char: String.fromCharCode(data.readUInt8(i)),
                position: data.readInt32LE(i + 1)
            };
            charConstraints.push(charConstraint);
        }
        return <WordConstraint>{ minLength, maxLength, isCommon, charConstraints };
    }
}
