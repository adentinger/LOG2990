import { Difficulty } from './difficulty';
import { WordSuggestions } from './word-suggestions';
import { WordPosition } from './word-position';
import { CharConstraint } from '../../../common/index';

export class WordSuggestionsGetter {

    private difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public getSuggestions(minLength: number,
                          maxLength: number,
                          charConstraints: CharConstraint[],
                          positionHint: WordPosition): WordSuggestions {
        return null;
    }

}
