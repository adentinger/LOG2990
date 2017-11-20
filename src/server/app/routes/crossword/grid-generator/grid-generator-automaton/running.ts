import { State } from './state';
import { Stopped } from './stopped';
import { Cancelling } from './cancelling';

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
