import { Word } from '../../word';
import { Difficulty } from '../../../../../../common/src/crossword/difficulty';

export interface GenerationParameters {
    wordsToInclude: Word[];
    difficulty: Difficulty;
}

export abstract class State {

    public abstract generation(parameters: GenerationParameters): State;

    public abstract cancellation(): State;

    public abstract done(): State;

    public abstract get generationParameters(): GenerationParameters;

}
