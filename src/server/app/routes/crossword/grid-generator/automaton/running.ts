import { State } from './state';
import { Cancelling } from './cancelling';

declare class Stopped extends State {
    public generation(): State;
    public cancellation(): State;
    public done(): State;
}

export class Running extends State {

    public generation(): State {
        throw new Error('Requesting generation while in Running state.');
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

}
