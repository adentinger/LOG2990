import { State } from './state';
import { Running } from './running';

export class Stopped extends State {

    public generation(): State {
        return new Running();
    }

    public cancellation(): State {
        return new Stopped();
    }

    public done(): State {
        throw new Error('Generation or cancellation done while in Stopped state.');
    }

}
