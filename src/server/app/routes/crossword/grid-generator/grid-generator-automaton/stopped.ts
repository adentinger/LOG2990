import { State } from './state';

export class Stopped extends State {

    public generation(): State {
        return null;
    }

    public cancellation(): State {
        return new Stopped();
    }

    public done(): State {
        throw new Error('Generation or cancellation done while in Stopped state.');
    }

}
