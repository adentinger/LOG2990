import { CharConstraint, isCharConstraint } from './char-constraint';

export interface WordConstraint {
    readonly charConstraints: CharConstraint[];
    readonly isCommon: boolean;
    readonly minLength: number;
    readonly maxLength?: number;
}

export function isWordConstraint(object: any): object is WordConstraint {
    return  ('minLength' in object && typeof object['minLength'] === 'number') &&
            ('isCommon' in object && typeof object['isCommon'] === 'boolean') &&
            ('charConstraints' in object && Array.isArray(object['charConstraints']) &&
                object['charConstraints'].every((element: any) => isCharConstraint(element)));
}
