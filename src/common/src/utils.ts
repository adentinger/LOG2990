export function isJson(pseudoJson: string): boolean {
    try {
        JSON.parse(pseudoJson);
        return true;
    } catch (error) {
        if (error instanceof SyntaxError) {
            return false;
        }
        throw error;
    }
}

export interface Constructor<T> extends Function {
    prototype: T;
    new(...argv: any[]): T;
}
export declare type Class<T> = Constructor<T>; // For comprehention's sake

export function toArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export function fromArrayBuffer(data: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(data));
}

export * from './prefixable-console';
