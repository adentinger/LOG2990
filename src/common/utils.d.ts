export declare function isJson(pseudoJson: string): boolean;
export interface Constructor<T extends Object = Object> extends Function {
    new (...argv: any[]): T;
}
export declare type Class<T = any> = Constructor<T> | Function;
export interface InstanceOf<T extends Constructor<InstanceOf<T>>> extends Object {
    readonly constructor: T | Function;
}
export declare function toArrayBuffer(str: string): ArrayBuffer;
export declare function fromArrayBuffer(data: ArrayBuffer): string;
export declare function getCallers(): string[];
export declare function warn(logger: {
    warn: (message: any) => void;
}): (error: any) => never;
export declare function warn<T>(logger: {
    warn: (message: any) => void;
}, returnValue: T): (error: any) => T;
