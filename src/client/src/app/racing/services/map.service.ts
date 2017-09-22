import { Injectable } from '@angular/core';

import { Map } from '../../admin-screen/map-editor/map';

@Injectable()
export class MapService {

    private readonly MAP_RESOURCE_URL = 'api/maps';

    constructor() { }

    public getByName(name: string): Promise<Map> {
        return Promise.reject('Not yet implemented');
    }

    public getMapNames(howMany: number): Promise<string[]> {
        return Promise.reject('Not yet implemented');
    }

    public putMap(map: Map): Promise<void> {
        return Promise.reject('Not yet implemented');
    }

    public postMap(map: Map): Promise<void> {
        return Promise.reject('Not yet implemented');
    }

}
