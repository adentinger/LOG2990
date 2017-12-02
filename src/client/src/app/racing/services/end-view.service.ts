import { Injectable } from '@angular/core';

@Injectable()
export class EndViewService {

  public displayGameResult;
  public mapName;

  constructor() {
    this.displayGameResult = null;
    this.mapName = '';
  }
}
