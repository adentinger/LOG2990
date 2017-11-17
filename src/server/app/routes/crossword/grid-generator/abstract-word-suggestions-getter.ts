import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { WordSuggestions } from './word-suggestions';
import { CharConstraint } from '../../../../../common/src/index';
import { WordPosition } from '../word-position';

export abstract class AbstractWordSuggestionsGetter {

    protected difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public abstract async getSuggestions(minLength: number,
                                         maxLength: number,
                                         charConstraints: CharConstraint[],
                                         positionHint: WordPosition): Promise<WordSuggestions>;

    public abstract async doSuggestionsExist(minLength: number,
                                             maxLength: number,
                                             charConstraints: CharConstraint[],
                                             positionHint: WordPosition): Promise<boolean>;

}
