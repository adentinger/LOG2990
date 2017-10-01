import { WordConstraint, isWordConstraint } from './word-constraint';
import { CharConstraint } from './char-constraint';

export class RegexBuilder {

    public buildFromConstraint(constraint: WordConstraint): RegExp {

        let regularExpression: string;
        regularExpression += '^';

        if (isWordConstraint(constraint)) {

            let positionBuffer = -1;
            const sortedCharConstraints: CharConstraint[] = constraint.charConstraints.sort((a, b) => a.position - b.position);

            const hasDuplicateEntry = !sortedCharConstraints.every((element) => {
                if (element.position !== positionBuffer) {
                    positionBuffer = element.position;
                    return true;
                } else {
                    return false;
                }
            });

            if (hasDuplicateEntry) {
                return null;
            }

            const first = sortedCharConstraints[0].position;

            if (first !== 0) {
                regularExpression += '.{' + sortedCharConstraints[0].position + '}';
            }
        }
        throw new Error('not implemented');
    }

}
