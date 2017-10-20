import { Difficulty } from '../../../common/crossword/difficulty';
import { WordSuggestions } from './word-suggestions';
import { WordPosition } from './word-position';
import { CharConstraint } from '../../../common/index';
import { LexiconCaller } from '../lexic/lexicon-caller';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class NormalWordSuggestionsGetter extends AbstractWordSuggestionsGetter {

    constructor(difficulty: Difficulty) {
        super(difficulty);
    }

    public async getSuggestions(minLength: number,
                                maxLength: number,
                                charConstraints: CharConstraint[],
                                positionHint: WordPosition): Promise<WordSuggestions> {
        let stringSuggestions: string[];
        try {
            stringSuggestions = await LexiconCaller.getInstance().getWords(
                minLength,
                maxLength,
                this.difficulty.isWordCommon(),
                charConstraints
            );
        }
        catch (e) {
            stringSuggestions = [];
        }
        const WORD_SUGGESTIONS = new WordSuggestions(stringSuggestions);
        return WORD_SUGGESTIONS;
    }

    public async doSuggestionsExist(minLength: number,
                                    maxLength: number,
                                    charConstraints: CharConstraint[],
                                    positionHint: WordPosition): Promise<boolean> {
        try {
            return await LexiconCaller.getInstance().doWordsExist(
                minLength,
                maxLength,
                this.difficulty.isWordCommon(),
                charConstraints
            );
        }
        catch (e) {
            return false;
        }
    }

}
