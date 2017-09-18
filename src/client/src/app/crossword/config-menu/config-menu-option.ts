import { PageId } from './config-menu-state';

export interface ConfigMenuOption {
    readonly name: string;
    readonly nextPage: PageId;
}

export interface FetchableOptionList {
    url: string;
    nextPage: PageId;
    fetchedOptions?: string[];
}
