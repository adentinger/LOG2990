import { Class, Constructor } from '../../utils';

export enum DataType {
    BOOL,
    INT,
    STRING,
    OBJECT
}

export abstract class PacketParser<T> {
    public static readonly SIZEOF_UINT8 = 1;
    public static readonly SIZEOF_UINT16 = 2;
    public static readonly SIZEOF_UINT32 = 4;

    public abstract serialize(value: T): ArrayBuffer;
    public abstract parse(data: ArrayBuffer): T;

    protected getObjectSize(object: any): number {
        let size = 0;
        for (const propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                switch (typeof object[propertyName]) {
                    case 'boolean':
                        size += PacketParser.SIZEOF_UINT8 +
                            PacketParser.SIZEOF_UINT8;
                        break;
                    case 'number':
                        size += PacketParser.SIZEOF_UINT8 +
                            PacketParser.SIZEOF_UINT32;
                        break;
                    case 'string':
                        size += PacketParser.SIZEOF_UINT8 +
                            PacketParser.SIZEOF_UINT32 + object[propertyName].length * PacketParser.SIZEOF_UINT16;
                        break;
                    case 'object':
                        size += PacketParser.SIZEOF_UINT8 +
                            PacketParser.SIZEOF_UINT32 + this.getObjectSize(object[propertyName]);
                        break;
                    default:
                        break;
                }
            }
        }
        return size;
    }

    protected toArrayBuffer(object: any): ArrayBuffer {
        console.log('+ %s', object.constructor.name);
        const BUFFER = new ArrayBuffer(this.getObjectSize(object));
        const VIEW = new DataView(BUFFER);
        let offset = 0;
        for (const propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                console.log(propertyName);
                switch (typeof object[propertyName]) {
                    case 'boolean':
                        VIEW.setUint8(offset, DataType.BOOL);
                        offset += PacketParser.SIZEOF_UINT8;
                        VIEW.setUint8(offset, object[propertyName]);
                        offset += PacketParser.SIZEOF_UINT8;
                        break;
                    case 'number':
                        VIEW.setUint8(offset, DataType.INT);
                        offset += PacketParser.SIZEOF_UINT8;
                        VIEW.setInt32(offset, object[propertyName]);
                        offset += PacketParser.SIZEOF_UINT32;
                        break;
                    case 'string':
                        VIEW.setUint8(offset, DataType.STRING);
                        offset += PacketParser.SIZEOF_UINT8;
                        VIEW.setUint32(offset, object[propertyName].length);
                        offset += PacketParser.SIZEOF_UINT32;
                        for (let i = 0; i < object[propertyName].length; ++i) {
                            VIEW.setUint16(offset, object[propertyName].charCodeAt(i));
                            offset += PacketParser.SIZEOF_UINT16;
                        }
                        break;
                    case 'object':
                        VIEW.setUint8(offset, DataType.OBJECT);
                        offset += PacketParser.SIZEOF_UINT8;
                        const subData = new DataView(this.toArrayBuffer(object[propertyName]));
                        VIEW.setInt32(offset, subData.byteLength);
                        offset += PacketParser.SIZEOF_UINT32;
                        for (let i = 0; i < subData.byteLength; ++i) {
                            VIEW.setUint8(offset, subData.getUint8(i));
                            offset += PacketParser.SIZEOF_UINT8;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        console.log('- %s', object.constructor.name);
        return BUFFER;
    }

    protected fromArrayBuffer(buffer: ArrayBuffer): any[] {
        const object: any[] = [], VIEW = new DataView(buffer);
        let offset = 0;
        while (offset < buffer.byteLength) {
            const TYPE = VIEW.getInt8(offset) as DataType;
            offset += PacketParser.SIZEOF_UINT8;
            let length: number;
            switch (TYPE) {
                case DataType.BOOL:
                    object.push(!!(VIEW.getUint8(offset)));
                    offset += PacketParser.SIZEOF_UINT8;
                    break;
                case DataType.INT:
                    object.push(VIEW.getInt32(offset));
                    offset += PacketParser.SIZEOF_UINT32;
                    break;
                case DataType.STRING:
                    length = VIEW.getInt32(offset);
                    offset += PacketParser.SIZEOF_UINT32;
                    const chars: number[] = [];
                    for (let i = 0; i < length; ++i) {
                        chars.push(VIEW.getUint16(offset));
                        offset += PacketParser.SIZEOF_UINT16;
                    }
                    object.push(String.fromCharCode(...chars));
                    break;
                case DataType.OBJECT:
                    length = VIEW.getInt32(offset);
                    offset += PacketParser.SIZEOF_UINT32;
                    object.push(this.fromArrayBuffer(buffer.slice(offset, offset + length)));
                    offset += length;
                    break;
                default:
                    break;
            }
        }
        return object;
    }

    protected fillProperties<T>(properties: any[], constructor: Class<T>): T {
        const object: T = new (constructor as Constructor<T>)();
        console.log('+ %s', constructor.name);
        let i = 0;
        for (const propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                console.log('%s: <%s>', propertyName, typeof properties[i], properties[i]);
                switch (typeof properties[i]) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        Object.assign(object[propertyName], properties[i]);
                        break;
                    case 'object':
                        console.log('proto.prop: ', constructor.prototype[propertyName]);
                        Object.assign(object[propertyName],
                            this.fillProperties(properties[i], Object.getPrototypeOf(object)[propertyName].constructor));
                        break;
                    default:
                        break;
                }
                ++i;
            }
        }
        console.log('- %s', constructor.name);
        return Object.assign(Object.create(constructor.prototype), object);
    }
}
