import { State } from './state';
import { Stopped } from './stopped';

declare class CancellingGenerationRequested extends State {
    public generation(): State;
    public cancellation(): State;
    public done(): State;
    public shouldGenerationBeRunning(): boolean;
}

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

    public shouldGenerationBeRunning(): boolean {
        return false;
    }

}
