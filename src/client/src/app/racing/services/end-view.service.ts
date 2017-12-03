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

    private static readonly ADDRESS = 'http://localhost:3000/racing/maps';
    private static readonly REQUEST_OPTIONS: RequestOptions = {
        observe: 'response',
        withCredentials: false,
        responseType: 'json'
    };

    public displayGameResult;
    public mapName;

    constructor(private http: HttpClient) {
        this.displayGameResult = null;
        this.mapName = '';
    }

    public saveMapRating(rating: number): void {
        const URL = EndViewService.ADDRESS + '/' + this.mapName + '/rating/' + rating;
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise().then(res => console.log(res));
    }
}
