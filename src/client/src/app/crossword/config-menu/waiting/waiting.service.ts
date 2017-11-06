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

    constructor() {
        this.isWaitingInternal.subscribe((value) => {
            this.isWaitingValueInternal = value;
        });
    }

    public get isWaiting(): Subject<boolean> {
        return this.isWaitingInternal;
    }

    public get isWaitingValue(): boolean {
        return this.isWaitingValue;
    }

}
