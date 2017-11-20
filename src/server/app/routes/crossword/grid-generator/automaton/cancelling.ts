import { State } from './state';
import { Stopped } from './stopped';
import { Word } from '../../word';
import { Difficulty } from '../../../../../../common/src/crossword/difficulty';

declare class CancellingGenerationRequested extends State {
    public generation(wordsToInclude: Word[], difficulty: Difficulty): State;
    public cancellation(): State;
    public done(): State;
    public shouldGenerationBeRunning(): boolean;
}

export class Cancelling extends State {

    public generation(wordsToInclude: Word[], difficulty: Difficulty): State {
        return new CancellingGenerationRequested();
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

}
