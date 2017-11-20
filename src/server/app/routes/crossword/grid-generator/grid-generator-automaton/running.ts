import { State } from './state';
import { Stopped } from './stopped';

export class Running extends State {

    public generation(): State {
        throw new Error('Requesting generation while in Running state.');
    }

    public cancellation(): State {
        return null;
    }

    public done(): State {
        return new Stopped();
    }

}
