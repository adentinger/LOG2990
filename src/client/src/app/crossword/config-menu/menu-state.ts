export interface Option {
    name: string;
    nextState: MenuState;
}

export class MenuState {

    private name: string;
    private options: Option[];

    constructor(name: string = '',
                options: Option[] = []) {
        this.name = name;
        this.options = options.slice();
    }

}
