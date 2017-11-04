export interface Option {
    name: string;
    nextState: MenuState;
}

export class MenuState {

    public static readonly none = null;

    private nameInternal: string;
    private optionsInternal: Option[];

    constructor(name: string = '',
                options: Option[] = []) {
        this.nameInternal = name;
        this.optionsInternal = options.slice();
    }

    public get name(): string {
        return this.name;
    }

    public get options(): Option[] {
        return this.optionsInternal.slice();
    }

    public addOption(option: Option): void {
    }

}
