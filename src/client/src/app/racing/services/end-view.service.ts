import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http/src/static_response';
import { HttpResponse } from '@angular/common/http/src/response';
import { Object } from '../../../../../common/src/index';


interface RequestOptions {
    observe: 'response';
    withCredentials: boolean;
    responseType: 'json';
}

@Injectable()
export class EndViewService {

    private static readonly MAX_BEST_TIMES = 5;
    private static readonly REQUEST_OPTIONS: RequestOptions = {
        observe: 'response',
        withCredentials: false,
        responseType: 'json'
    };

    private static readonly MAP_SERVER_PATH = 'http://localhost:3000/racing/maps/';

    public displayGameResult;
    public mapName;
    public mapBestTimes;
    public isInMapBestTimes;
    public userTime = 2;
    public userIsFirstPlace = true;

    constructor(private http: HttpClient) {
    }

    public initializationForNewMap(mapName: string): void {
        this.mapName = mapName;
        this.setMapBestTimes();
        this.displayGameResult = null;
    }

    public updateMapRating(rating: number): void {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/rating/' + rating;
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }

    public getMapBestTimes(): Promise<HttpResponse<Object>> {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/best-times';
        return this.http.get(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }

    public async setMapBestTimes(): Promise<void> {
        this.mapBestTimes = [];
        await this.getMapBestTimes().then(response => {
            const tempArray = response.body;
            for (let i = 0 ; i < EndViewService.MAX_BEST_TIMES; i++) {
                if (tempArray[i] !== undefined) {
                    this.mapBestTimes.push(tempArray[i]);
                }
            }
        });
    }

    public updateMapBestTime(userName: string): void {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/best-times/player/' + userName
        + '/time/' + this.userTime;
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }

    public userIsInMapBestTimes(): Boolean {
        if (this.userIsFirstPlace) {
            if (this.mapBestTimes.length === EndViewService.MAX_BEST_TIMES) {
                this.mapBestTimes.sort();
                return this.userTime < this.mapBestTimes[this.mapBestTimes.length - 1].value;
            } else if (this.mapBestTimes.length >= 0 &&
                 this.mapBestTimes.length < EndViewService.MAX_BEST_TIMES) {
                return true;
            }
        }
        return false;
    }

    public incrementMapNumberOfPlays(): void {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/increment-plays';
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }
}
