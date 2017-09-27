export interface CharConstraint {
    readonly char: string;
    readonly position: number;
}

export function isCharConstraint(object: any): object is CharConstraint {
    return ('char' in object && typeof object['char'] === 'string' && object['char'].length === 1) &&
           ('position' in object && typeof object['position'] === 'number' && object['position'] >= 0);
}
