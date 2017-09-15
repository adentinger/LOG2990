import { Injectable, Inject } from '@angular/core';
import { ConfigMenuState } from './enums';

@Injectable()
export class ConfigMenuService {

    constructor( @Inject('menuPages') private menuPages: any[]) {
    }

    public getCurrentState<PageType>(): PageType {
        // Mock
        return null;
    }

}
