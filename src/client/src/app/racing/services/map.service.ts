import { Injectable } from '@angular/core';

import { Map } from '../../admin-screen/map-editor/map';

@Injectable()
export class MapService {

    private readonly MAP_RESOURCE_URL = 'api/maps';

    constructor() { }

    public getByName(name: string): Promise<Map> {
        return Promise.reject('Not yet implemented');
    }

    public putByName(name: string): Promise<void> {
        return Promise.reject('Not yet implemented');
    }

    public postByName(): Promise<void> {
        return Promise.reject('Not yet implemented');
    }

}
