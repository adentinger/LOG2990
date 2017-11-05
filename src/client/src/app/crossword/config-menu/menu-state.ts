export interface Option {
    name: string;
    nextState: MenuState;
}

export class MenuState {

    public static readonly none = null;

    private nameInternal: string;
    private optionsInternal: Option[];
    private onArriveCallback = () => {};

    constructor(name: string = '',
                options: Option[] = []) {
        this.nameInternal = name;
        this.optionsInternal = options.slice();
    }

    public get name(): string {
        return this.nameInternal;
    }

    public get options(): Option[] {
        return this.optionsInternal.slice();
    }

    public addOption(option: Option): void {
        this.optionsInternal.push(option);
    }

    public setOnArriveCallback(callback: () => void): void {
        this.onArriveCallback = callback;
    }

}
