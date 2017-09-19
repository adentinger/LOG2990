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
    fetchedOptions?: string[];
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
                if (!(typeof value === 'string')) {
                    options.fetchedOptions.push(JSON.stringify(value));
                } else {
                    options.fetchedOptions.push(value);
                }
            });
        }
    });
    return observable;
}
