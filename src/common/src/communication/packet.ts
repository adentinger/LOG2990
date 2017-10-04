export abstract class Packet<T> {
    constructor (protected value: T) { }
    public abstract serialize(): Buffer;
    public abstract parse(data: Buffer): T;
}
