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

export interface Constructor<T extends Object> extends Function {
    new(...argv: any[]): T;
}
export declare type Class<T> = Constructor<T> | Function; // For comprehention's sake

export interface InstanceOf<T extends Constructor<InstanceOf<T>>> extends Object {
    readonly constructor: T | Function;
}

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

const CALL_STACK_REGEX = /\s*at\s(.+)\s\(.+:\d+:\d+\)/;

export function getCallers(): string[] {
    try {
        throw new Error();
    } catch (e) {
        const error = e as Error;
        try {
            const callers = error.stack.match(new RegExp(CALL_STACK_REGEX, 'g'))
                .map((value) => value.match(CALL_STACK_REGEX)[1]);
            callers.shift();
            return callers;
        } catch (e) {
            return null;
        }
    }
}
