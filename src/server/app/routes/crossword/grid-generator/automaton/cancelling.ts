import { State } from './state';
import { Stopped } from './stopped';
import { CancellingGenerationRequested } from './cancelling-generation-requested';

export class Cancelling extends State {

    public generation(): State {
        return new CancellingGenerationRequested();
    }

    public cancellation(): State {
        return new Cancelling();
    }

    public done(): State {
        return new Stopped();
    }

}
