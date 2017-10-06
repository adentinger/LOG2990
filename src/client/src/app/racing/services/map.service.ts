import { Injectable } from '@angular/core';

import { Map } from '../../admin-screen/map-editor/map';
import { MAPS } from './mock-maps';

const MAX_IDS_PER_REQUEST = 100;

@Injectable()
export class MapService {

    /*
    public maps: Map[];

    constructor() {
        this.maps = MAPS.slice();
    }

    public getById(id: number): Promise<Map> {
        const MAP = this.maps[id];
        if (MAP !== undefined) {
            return Promise.reject('');
        }
        else {
            return Promise.reject(`ID ${id} does not exist`);
        }
    }

    public getMapIds(howMany: number): Promise<number[]> {
        if (howMany > MAX_IDS_PER_REQUEST) {
            const IDS = [];
            for (let i = 0; i < howMany; ++i) {
                IDS.push(i);
            }
            return Promise.resolve(IDS);
        }
        else {
            return Promise.reject('Too many ids required.');
        }
    }

    public postMap(map: Map): Promise<number> {
        return Promise.reject('Not yet implemented');
    }

    public putMap(map: Map, id: number): Promise<void> {
        return Promise.reject('Not yet implemented');
    }
    */

    public getMaps(): Promise<Map[]> {
        return Promise.resolve(MAPS);
    }

}
