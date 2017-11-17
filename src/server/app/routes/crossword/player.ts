export class Player {

    private nameInternal: string;
    private socketIdInternal: string;

    public get name(): string {
        return this.nameInternal;
    }

    public get socketId(): string {
        return this.socketIdInternal;
    }

    constructor(name: string, socketId: string) {
        this.nameInternal = name;
        this.socketIdInternal = socketId;
    }

}
