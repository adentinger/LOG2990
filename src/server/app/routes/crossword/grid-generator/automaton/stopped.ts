import { State } from './state';
import { Running } from './running';
import { Word } from '../../word';
import { Difficulty } from '../../../../../../common/src/crossword/difficulty';

export class Stopped extends State {

    public generation(wordsToInclude: Word[], difficulty: Difficulty): State {
        return new Running();
    }

    public cancellation(): State {
        return new Stopped();
    }

    public done(): State {
        throw new Error('Generation or cancellation done while in Stopped state.');
    }

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

}
