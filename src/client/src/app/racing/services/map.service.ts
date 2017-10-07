import { Injectable } from '@angular/core';

import { SerializedMap } from '../../admin-screen/map-editor/serialized-map';
import { Map } from '../../admin-screen/map-editor/map';
import { MAPS } from './mock-maps';

@Injectable()
export class MapService {

    public maps: Map[];

    constructor() {
    }

    public saveNew(serializedMap: SerializedMap): Promise<void> {
        return Promise.reject('Not yet implemented');
    }

    public saveEdited(): Promise<void> {
        return Promise.reject('Not yet implemented');
    }

    public delete(name: string): Promise<number[]> {
        return Promise.reject('Not yet implemented');
    }

    public getMapNames(count: number): Promise<string[]> {
        return Promise.reject('Not yet implemented');
    }

    public getByName(name: string): Promise<Map> {
        return Promise.reject('Not yet implemented');
    }

    // To be deleted ; mock method.
    public getMaps(): Promise<Map[]> {
        return Promise.resolve(MAPS);
    }

}
