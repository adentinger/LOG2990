import { Injectable } from '@angular/core';

import { Map } from '../../admin-screen/map-editor/map';
import { MAPS } from './mock-maps';

@Injectable()
export class MapService {

    public maps: Map[];

    constructor() {
        this.maps = MAPS.slice();
    }

    public getById(id: number): Promise<Map> {
        return Promise.reject('Not yet implemented');
    }

    public getMapIds(howMany: number): Promise<number[]> {
        return Promise.reject('Not yet implemented');
    }

    public putMap(map: Map): Promise<number> {
        return Promise.reject('Not yet implemented');
    }

    public postMap(map: Map): Promise<number> {
        return Promise.reject('Not yet implemented');
    }

}
