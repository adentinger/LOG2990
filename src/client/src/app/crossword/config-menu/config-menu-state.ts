import { ConfigMenuOption, FetchableOptionList } from './config-menu-option';

export type PageId = number;

type ConfigMenuOptions = ConfigMenuOption[] | FetchableOptionList;

export class ConfigMenuState {
    public readonly options: ConfigMenuOptions = [];

    private static isState(object: any): boolean {
        if (typeof object['id'] === 'number' &&
            typeof object['name'] === 'string' &&
            object['options'] !== undefined) {
            if (Array.isArray(object['options'])) {
                for (const option of (object['options'] as any[])) {
                    if (!('name' in option && typeof option.name === 'string') ||
                        !('nextPage' in option && typeof option.nextPage === 'number')) {
                        return false;
                    }
                }
                return true;
            } else if (('url' in object['options'] &&
                        typeof object['options'].url === 'string') &&
                       ('nextPage' in object['options'] &&
                        typeof object['options'].nextPage === 'number')) {
                return true;
            }
        }
        return false;
    }

    public static fromJson(json: any): ConfigMenuState[] {
        const parsedStates: ConfigMenuState[] = [];
        if (Array.isArray(json)) {
            for (const state of (json as any[])) {
                if (!ConfigMenuState.isState(state)) {
                    throw new TypeError('Not a ConfigMenuState');
                } else {
                    parsedStates.push(new ConfigMenuState(state.id, state.name, state.options));
                }
            }
        } else if (!ConfigMenuState.isState(json)) {
            throw new TypeError('Not a ConfigMenuState');
        } else {
            parsedStates.push(new ConfigMenuState(json.id, json.name, json.options));
        }
        return parsedStates;
    }

    constructor(
        public readonly id: PageId,
        public readonly name: string,
        options: ConfigMenuOptions = []) {
        if (id < 0) {
            throw new RangeError('Bad id');
        }
        if (Array.isArray(options)) {
            (this.options as ConfigMenuOption[]).push.apply(this.options, options);
        } else {
            this.options = options;
        }
    }
}
