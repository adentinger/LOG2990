import { ConfigMenuOption, FetchableOptionList, isOptionList, fetchOptions } from './config-menu-option';
import { HttpClient } from '@angular/common/http';

export type PageId = number;

type ConfigMenuOptions = ConfigMenuOption[] | FetchableOptionList;

export class ConfigMenuState {
    public readonly options: ConfigMenuOptions = [];

    public static isState(object: any): boolean {
        if (typeof object['id'] === 'number' &&
            typeof object['name'] === 'string' &&
            object['options'] !== undefined) {
            if (isOptionList(object['options'])) {
                return true;
            }
        }
        return false;
    }

    public static fromJson(json: any, http: HttpClient): ConfigMenuState[] {
        const parsedStates: ConfigMenuState[] = [];
        if (Array.isArray(json)) {
            for (const state of (json as any[])) {
                if (!ConfigMenuState.isState(state)) {
                    throw new TypeError('Not a ConfigMenuState');
                } else {
                    parsedStates.push(new ConfigMenuState(state.id, state.name, state.options, http));
                }
            }
        } else if (!ConfigMenuState.isState(json)) {
            throw new TypeError('Not a ConfigMenuState');
        } else {
            parsedStates.push(new ConfigMenuState(json.id, json.name, json.options, http));
        }
        return parsedStates;
    }

    public static hasFetchableOptions(state: ConfigMenuState): boolean {
        return state !== undefined &&
            state.options !== undefined &&
            !Array.isArray(state.options);
    }

    constructor(
        public readonly id: PageId,
        public readonly name: string,
        options: ConfigMenuOptions = [],
        http: HttpClient) {
        if (id < 0) {
            throw new RangeError('Bad id');
        }
        if (Array.isArray(options)) {
            (this.options as ConfigMenuOption[]).push.apply(this.options, options);
        } else {
            this.options = options;
            fetchOptions(this.options, http);
        }
    }
}
