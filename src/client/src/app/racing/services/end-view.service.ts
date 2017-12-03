import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpResponse } from '@angular/common/http/src/response';


@Injectable()
export class EndViewService {

  private static readonly ADDRESS = 'http://localhost:3000';
  private static readonly AUTHENTICATION_PATH = '/admin/authentication/';
  private http: HttpClient;

  public displayGameResult;
  public mapName;

  constructor() {
    this.displayGameResult = null;
    this.mapName = '';
    this.http = new HttpClient(EndViewService.ADDRESS);
  }
}
