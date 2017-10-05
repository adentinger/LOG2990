import { WordConstraint, isWordConstraint } from './word-constraint';
import { CharConstraint } from './char-constraint';

export class RegexBuilder {

    public buildFromConstraint(constraint: WordConstraint): RegExp {

        let regularExpression: string;
        regularExpression = '';

        if (isWordConstraint(constraint)) {

            constraint.maxLength = 'maxLength' in constraint ? constraint.maxLength : constraint.minLength;

            const SORTED_CHAR_CONSTRAINTS: CharConstraint[] = constraint.charConstraints.sort((a, b) => a.position - b.position);

            if (this.checkConstraints(SORTED_CHAR_CONSTRAINTS, constraint) === false) {
                return null;
            }

            regularExpression += this.createRegex(regularExpression, SORTED_CHAR_CONSTRAINTS, constraint);

            const flags = 'i';
            const REG_EXP: RegExp = new RegExp(regularExpression, flags);

            return REG_EXP;
        } else {
            return null;
        }
    }

    private checkConstraints(sortedConstraints: CharConstraint[], constraint: WordConstraint): boolean {

        if (this.checkLengthConstraint(constraint) === true
            && this.checkDuplicates(sortedConstraints) === true
            && this.checkPositionConstraint(sortedConstraints, constraint) === true) {
            return true;
        } else {
            return false;
        }

    }

    private checkDuplicates(sortedConstraints: CharConstraint[]): boolean {

        let positionBuffer = -1;

        for (let i = 0; i < sortedConstraints.length; i++) {
            if (sortedConstraints[i].position !== positionBuffer) {
                positionBuffer = sortedConstraints[i].position;
            } else {
                return false;
            }
        }
        return true;
    }

    private checkLengthConstraint(constraint: WordConstraint): boolean {

        if (constraint.minLength > constraint.maxLength && constraint.minLength >= 0) {
            return false;
        } else {
            return true;
        }
    }

    private checkPositionConstraint(sortedConstraints: CharConstraint[], constraint: WordConstraint): boolean {

        if (sortedConstraints.length > 0
            && sortedConstraints[sortedConstraints.length - 1].position >= constraint.minLength) {
            return false;
        } else {
            return true;
        }
    }

    private createRegex(regEx: string, sortedConstraints: CharConstraint[], constraint: WordConstraint): string {

        regEx = '^';

        let previous = -1;

        for (let i = 0; i < sortedConstraints.length; i++) {

            const CURRENT = sortedConstraints[i].position;

            if (CURRENT - previous > 1) {
                regEx += '.{' + (CURRENT - previous - 1) + '}';
            }

            regEx += sortedConstraints[i].char;
            previous = CURRENT;

        }

        if (previous <= constraint.minLength && constraint.maxLength > constraint.minLength) {
            regEx += '.{' + (constraint.minLength
                - previous - 1) + ','
                + (constraint.maxLength
                    - previous - 1) + '}$';
        } else if (previous === constraint.minLength - 1) {
            regEx += '$';
        } else if (previous !== constraint.minLength) {
            regEx += '.{' + (constraint.minLength
                - previous - 1) + '}$';
        }

        return regEx;
    }
}

