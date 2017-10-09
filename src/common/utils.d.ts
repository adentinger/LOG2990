export declare function isJson(pseudoJson: string): boolean;
export interface Constructor<T> extends Function {
    prototype: T;
    new (...argv: any[]): T;
}
export declare type Class<T> = Constructor<T>;
export declare function toArrayBuffer(str: string): ArrayBuffer;
export declare function fromArrayBuffer(data: ArrayBuffer): string;
