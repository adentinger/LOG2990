import { State } from './state';
import { Cancelling } from './cancelling';
import { Word } from '../../word';
import { Difficulty } from '../../../../../../common/src/crossword/difficulty';

declare class Stopped extends State {
    public generation(): State;
    public cancellation(): State;
    public done(): State;
    public shouldGenerationBeRunning(): boolean;
}

export class Running extends State {

    public generation(wordsToInclude: Word[], difficulty: Difficulty): State {
        throw new Error('Requesting generation while in Running state.');
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

    public shouldGenerationBeRunning(): boolean {
        return true;
    }

}
