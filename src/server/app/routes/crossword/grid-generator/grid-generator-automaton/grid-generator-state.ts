export abstract class GridGeneratorState {

    public abstract generation(): GridGeneratorState;

    public abstract cancellation(): GridGeneratorState;

    public abstract done(): GridGeneratorState;

}
