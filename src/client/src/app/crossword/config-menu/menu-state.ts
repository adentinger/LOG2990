import { Subject } from 'rxjs/Subject';

export interface Option {
    name: string;
    nextState: MenuState;
    value: any;
}

export class MenuState {

    public static readonly none = new MenuState();

    private nameInternal: string;
    private fieldName: string;
    private optionsInternal: Option[];
    private arriveInternal = new Subject<void>();
    private leaveInternal = new Subject<void>();

    constructor(name: string = '',
                fieldName: string = '',
                options: Option[] = []) {
        this.nameInternal = name;
        this.fieldName = fieldName;
        this.optionsInternal = options.slice();
    }

    public get name(): string {
        return this.nameInternal;
    }

    public get options(): Option[] {
        return this.optionsInternal.slice();
    }

    public get arrive(): Subject<void> {
        return this.arriveInternal;
    }

    public get leave(): Subject<void> {
        return this.leaveInternal;
    }

    public addOption(option: Option): void {
        this.optionsInternal.push(option);
    }

}
