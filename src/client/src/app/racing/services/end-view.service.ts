import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface RequestOptions {
    observe: 'response';
    withCredentials: boolean;
    responseType: 'json';
}

@Injectable()
export class EndViewService {

    private static readonly ADDRESS = 'http://localhost:3000/racing/maps';
    private static readonly REQUEST_OPTIONS: RequestOptions = {
        observe: 'response',
        withCredentials: false,
        responseType: 'json'
    };

    public displayGameResult;
    public mapName;
    public numberOfStar;

    constructor(private http: HttpClient) {
        this.displayGameResult = null;
        this.mapName = '';
    }

    public patchMapRating(rating: number): void {
        const URL = EndViewService.ADDRESS + '/' + this.mapName + '/rating/' + rating;
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise();
        console.log(URL, 'postMapRating');
    }
}
