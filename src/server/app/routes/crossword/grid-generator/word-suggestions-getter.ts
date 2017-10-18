import { Difficulty } from './difficulty';
import { WordSuggestions } from './word-suggestions';
import { WordPosition } from './word-position';
import { CharConstraint } from '../../../common/index';
import { LexiconCaller } from '../lexic/lexicon-caller';

export class WordSuggestionsGetter {

    private difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public async getSuggestions(minLength: number,
                                maxLength: number,
                                charConstraints: CharConstraint[],
                                positionHint: WordPosition): Promise<WordSuggestions> {
        const STRING_SUGGESTIONS = await LexiconCaller.getInstance().getWords(
            minLength,
            maxLength,
            this.difficulty.isWordCommon(),
            charConstraints
        );
        const WORD_SUGGESTIONS = new WordSuggestions(STRING_SUGGESTIONS);
        return WORD_SUGGESTIONS;
    }

}
