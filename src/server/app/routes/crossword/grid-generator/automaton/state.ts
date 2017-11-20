export abstract class State {

    public abstract generation(): State;

    public abstract cancellation(): State;

    public abstract done(): State;

    public abstract shouldGenerationBeRunning(): boolean;

}
