import { PageId } from './config-menu-state';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface ConfigMenuOption {
    readonly name: string;
    readonly nextPage: PageId;
}

export interface FetchableOptionList {
    url: string;
    nextPage: PageId;
    fetchedOptions?: FetchedPendingGame[];
}

type CrosswordGameMode = 'classic' | 'dynamic';
type CrosswordGameDifficulty = 'easy' | 'normal' | 'brutal';

export class FetchedPendingGame {
    public player: string;
    public mode: CrosswordGameMode;
    public difficulty: CrosswordGameDifficulty;
    public toString(): string {
        return this.player + ' [' + this.mode + ' - ' + this.difficulty + ']';
    }
}

export function isPendingGame(game: any): game is FetchedPendingGame {
    const MODES: CrosswordGameMode[] = ['classic', 'dynamic'];
    const DIFFICULTIES: CrosswordGameDifficulty[] = ['easy', 'normal', 'brutal'];

    const IS_IN_ARRAY = <T>(valueToCheck: T, array: T[]) =>
        array.findIndex((valueInArray: T): boolean => valueToCheck === valueInArray) >= 0;

    return  game !== null && (
                'player' in game && typeof game['player'] === 'string' &&
                'mode' in game && typeof game['mode'] === 'string' &&
                    IS_IN_ARRAY(game['mode'], MODES) &&
                'difficulty' in game && typeof game['difficulty'] === 'string' &&
                    IS_IN_ARRAY(game['difficulty'], DIFFICULTIES)
            );
}

export function isOptionList(object: any): object is FetchableOptionList | ConfigMenuOption[] {
    if (Array.isArray(object)) {
        for (const option of (object as any[])) {
            if (!('name' in option && typeof option.name === 'string') ||
                !('nextPage' in option && typeof option.nextPage === 'number')) {
                return false;
            }
        }
        return true;
    } else if (('url' in object &&
                typeof object.url === 'string') &&
               ('nextPage' in object &&
                typeof object.nextPage === 'number')) {
        return true;
    }
    return false;
}

export function fetchOptions(options: FetchableOptionList, http: HttpClient): Observable<Object> {
    if (options.fetchedOptions === undefined) {
        options.fetchedOptions = [];
    }
    const observable = http.get(options.url, {responseType: 'json'});
    observable.subscribe((json: Object) => {
        if (Array.isArray(json)) {
            json.forEach((value: any) => {
                if (isPendingGame(value)) {
                    options.fetchedOptions.push(value as FetchedPendingGame);
                }
            });
        }
    });
    return observable;
}
