import { ConfigMenuOption, FetchableOptionList } from './config-menu-option';

export type PageId = number;

type ConfigMenuOptions = ConfigMenuOption[] | FetchableOptionList;

export class ConfigMenuState {
    public readonly options: ConfigMenuOptions = [];

    constructor(
        public readonly id: PageId,
        public readonly name: string,
        options: ConfigMenuOptions = []) {
        if (Array.isArray(options)) {
            (this.options as ConfigMenuOption[]).push.apply(this.options, options);
        } else {
            this.options = options;
        }
    }
}
