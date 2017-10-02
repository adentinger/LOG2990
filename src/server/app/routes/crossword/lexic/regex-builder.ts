import { WordConstraint, isWordConstraint } from './word-constraint';
import { CharConstraint } from './char-constraint';

export class RegexBuilder {

    public buildFromConstraint(constraint: WordConstraint): RegExp {

        let regularExpression: string;
        regularExpression = '^';

        if (isWordConstraint(constraint)) {
            if (constraint.charConstraints.length !== 0) {

                let positionBuffer = -1;
                const SORTED_CHAR_CONSTRAINTS: CharConstraint[] = constraint.charConstraints.sort((a, b) => a.position - b.position);

                const HAS_DUPLICATE_ENTRY = !SORTED_CHAR_CONSTRAINTS.every((element) => {
                    if (element.position !== positionBuffer) {
                        positionBuffer = element.position;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (HAS_DUPLICATE_ENTRY) {
                    return null;
                }

                for (let i = 0; i < SORTED_CHAR_CONSTRAINTS.length; i++) {

                    const CURRENT = SORTED_CHAR_CONSTRAINTS[i].position;

                    if (CURRENT === 0 || (CURRENT === SORTED_CHAR_CONSTRAINTS[i - 1].position + 1
                        && CURRENT !== SORTED_CHAR_CONSTRAINTS.length)) {
                        regularExpression += SORTED_CHAR_CONSTRAINTS[i].char;
                    } else if (CURRENT === SORTED_CHAR_CONSTRAINTS.length - 1 && CURRENT === constraint.maxLength - 1) {
                        regularExpression += SORTED_CHAR_CONSTRAINTS[i] + '$';
                    } else if (CURRENT === SORTED_CHAR_CONSTRAINTS.length - 1 && CURRENT !== constraint.maxLength - 1) {
                        regularExpression += SORTED_CHAR_CONSTRAINTS[i] + '.{'
                        + (constraint.maxLength - SORTED_CHAR_CONSTRAINTS[i].position - 1) + '}$';
                    } else if (CURRENT !== 0 && CURRENT === constraint.maxLength - 1 && CURRENT <= constraint.minLength) {
                        regularExpression += SORTED_CHAR_CONSTRAINTS[i].char + '.{'
                        + (constraint.minLength - SORTED_CHAR_CONSTRAINTS[i].position) + ','
                        + (constraint.maxLength - SORTED_CHAR_CONSTRAINTS[i].position) + '}$';
                    } else if (CURRENT !== 0 && CURRENT + 1 !== SORTED_CHAR_CONSTRAINTS[i + 1].position) {
                        regularExpression += SORTED_CHAR_CONSTRAINTS[i].char + '.{'
                        + (SORTED_CHAR_CONSTRAINTS[i + 1].position - SORTED_CHAR_CONSTRAINTS[i].position) + '}';
                    }
                }
            } else {
                regularExpression += '$';
            }

            const REG_EXP: RegExp = new RegExp(regularExpression, 'i');
            return REG_EXP;
        } else {
            return null;
        }
    }

}
