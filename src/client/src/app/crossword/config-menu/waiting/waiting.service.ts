import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * @class WaitingService
 * @description Has the responsibility of containing whether we are waiting,
 * and notifying when we no longer wait.
 */
@Injectable()
export class WaitingService {

    private isWaitingInternal = new Subject<boolean>();
    private isWaitingValueInternal: boolean;

    constructor() { }

    public get isWaiting(): Subject<boolean> {
        return null;
    }

    public get isWaitingValue(): boolean {
        return this.isWaitingValue;
    }

}
