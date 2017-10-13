export declare function isJson(pseudoJson: string): boolean;
export interface Constructor<T extends Object> extends Function {
    new (...argv: any[]): T;
}
export declare type Class<T> = Constructor<T> | Function;
export interface InstanceOf<T extends Constructor<InstanceOf<T>>> extends Object {
    readonly constructor: T | Function;
}
export declare function toArrayBuffer(str: string): ArrayBuffer;
export declare function fromArrayBuffer(data: ArrayBuffer): string;
