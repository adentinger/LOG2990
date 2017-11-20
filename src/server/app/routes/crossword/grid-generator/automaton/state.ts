import { Word } from '../../word';
import { Difficulty } from '../../../../../../common/src/crossword/difficulty';

export abstract class State {

    public abstract generation(wordsToInclude: Word[], difficulty: Difficulty): State;

    public abstract cancellation(): State;

    public abstract done(): State;

    public abstract shouldGenerationBeRunning(): boolean;

}
