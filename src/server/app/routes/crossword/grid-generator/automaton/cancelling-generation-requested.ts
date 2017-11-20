import { State } from './state';
import { Cancelling } from './cancelling';
import { Running } from './running';
import { Difficulty } from '../../../../../../common/src/crossword/difficulty';
import { Word } from '../../word';

export class CancellingGenerationRequested extends State {

    public generation(wordsToInclude: Word[], difficulty: Difficulty): State {
        throw new Error('Generation while in CancellingGenerationRequested state.');
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Running;
    }

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

}
