import { State } from './state';
import { Cancelling } from './cancelling';
import { Running } from './running';

export class CancellingGenerationRequested extends State {

    public generation(): State {
        throw new Error('Generation while in CancellingGenerationRequested state.');
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Running;
    }

}
