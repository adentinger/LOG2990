import { Injectable } from '@angular/core';

import { SerializedMap } from '../../admin-screen/map-editor/serialized-map';
import { Map } from '../../admin-screen/map-editor/map';
import { MockSerializedMaps } from '../../admin-screen/map-editor/mock-serialized-maps';

@Injectable()
export class MapService {

    public maps: Map[];
    private mockSerializedMaps: MockSerializedMaps = new MockSerializedMaps;

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
    public getMaps(): Promise<SerializedMap[]> {
        return Promise.resolve(this.mockSerializedMaps.functionnalMaps());
    }

}
