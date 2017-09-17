import { PageId } from './config-menu-state';

export interface FetchableOptionList {
    url: string;
    nextPage: PageId;
}

export interface ConfigMenuOption {
    readonly name: string;
    readonly nextPage: PageId;
}
