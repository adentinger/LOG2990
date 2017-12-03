import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http/src/static_response';
import { HttpResponse } from '@angular/common/http/src/response';


interface RequestOptions {
    observe: 'response';
    withCredentials: boolean;
    responseType: 'json';
}

@Injectable()
export class EndViewService {

    private static readonly REQUEST_OPTIONS: RequestOptions = {
        observe: 'response',
        withCredentials: false,
        responseType: 'json'
    };

    private static readonly MAP_SERVER_PATH = 'http://localhost:3000/racing/maps';

    public displayGameResult;
    public mapName;
    public mapBestTimes;

    constructor(private http: HttpClient) {
        this.displayGameResult = null;
        this.mapName = '';
    }

    public saveMapRating(rating: number): void {
        const URL = EndViewService.MAP_SERVER_PATH + '/' + this.mapName + '/rating/' + rating;
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise().then(res => console.log(res));
    }

    public getMapBestTimes(): Promise<HttpResponse<Object>> {
        const URL = EndViewService.MAP_SERVER_PATH + '/' + this.mapName + '/best-times';
        return this.http.get(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }

    public async setMapBestTimes(): Promise<void> {
        await this.getMapBestTimes().then(response => this.mapBestTimes = response.body);
    }
}
