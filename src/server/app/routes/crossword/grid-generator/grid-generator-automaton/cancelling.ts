import { State } from './state';
import { Stopped } from './stopped';

export class Cancelling extends State {

    public generation(): State {
        return null;
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

}
