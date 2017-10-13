import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { SerializedMap } from '../../common/racing/serialized-map';
import { Map } from '../../admin-screen/map-editor/map';
import { MockSerializedMaps } from '../../common/racing/mock-serialized-maps';

@Injectable()
export class MapService {

    private static readonly HEADERS: RequestOptionsArgs =
        {headers: new Headers({'Content-Type': 'application/json'})};

    public maps: Map[];
    private mockSerializedMaps: MockSerializedMaps = new MockSerializedMaps;

    constructor(private http: Http) {
    }

    public saveNew(serializedMap: SerializedMap): Promise<void> {
        const url = 'http://localhost:3000/racing/maps';
        return this.http.post(url, JSON.stringify(serializedMap), MapService.HEADERS).toPromise().then(() => null);
    }

    public saveEdited(serializedMap: SerializedMap): Promise<void> {
        const url = 'http://localhost:3000/racing/maps/';
        return this.http.put(url, JSON.stringify(serializedMap), MapService.HEADERS).toPromise().then(() => null);
    }

    public delete(name: string): Promise<void> {
        const url = 'http://localhost:3000/racing/maps/' + name;
        return this.http.delete(url).toPromise().then(() => null);
    }

    public getMapNames(count: number): Promise<string[]> {
        const url = 'http://localhost:3000/racing/map-names/' + count;
        return this.http.get(url).toPromise().then(response => response.json() as string[]);
    }

    public getByName(name: string): Promise<SerializedMap> {
        const url = 'http://localhost:3000/racing/maps/' + name;
        return this.http.get(url).toPromise().then(response => response.json() as SerializedMap);
    }

    // To be deleted ; mock method.
    public getMaps(): Promise<SerializedMap[]> {
        return Promise.resolve(this.mockSerializedMaps.functionnalMaps());
    }

}
