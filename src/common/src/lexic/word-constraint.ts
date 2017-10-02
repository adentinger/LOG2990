import { CharConstraint, isCharConstraint } from './char-constraint';
import { isJson } from '../utils';

export class WordConstraint {
    public readonly charConstraints: CharConstraint[];
    public readonly isCommon: boolean;
    public readonly minLength: number;
    public readonly maxLength?: number;
}

function isCharConstraintArray(object: any): object is CharConstraint[] {
    return Array.isArray(object) &&
        object.every((element: any) => isCharConstraint(element));
}

export function isWordConstraint(object: any): boolean {
    return ('minLength' in object && +object['minLength'] !== NaN) &&
        ('isCommon' in object) && (
            'charConstraints' in object && (
                isCharConstraintArray(object['charConstraints']) || (
                    typeof object['charConstraints'] === 'string' &&
                    isJson(object['charConstraints']) &&
                    isCharConstraintArray(JSON.parse(object['charConstraints']))
                )
            )
        );
}

export function parseWordConstraint(pseudoWordConstraint: any): WordConstraint {
    if (!isWordConstraint(pseudoWordConstraint) &&
        (
            typeof pseudoWordConstraint === 'string' &&
            isJson(pseudoWordConstraint) &&
            !isWordConstraint(JSON.parse(pseudoWordConstraint))
        )
    ) {
        throw new SyntaxError('Passed object is not a WordConstraint');
    }
    let parsedJson: any;
    if (typeof pseudoWordConstraint === 'string') {
        parsedJson = JSON.parse(pseudoWordConstraint);
    } else {
        parsedJson = pseudoWordConstraint;
    }
    return <WordConstraint>{
        minLength: +parsedJson.minLength,
        maxLength: 'maxLength' in parsedJson ? +parsedJson.maxLength : undefined,
        isCommon: Boolean(parsedJson.isCommon),
        charConstraints: (typeof parsedJson.charConstraints === 'string') ?
            JSON.parse(parsedJson.charConstraints) :
            parsedJson.charConstraints
    };
}
