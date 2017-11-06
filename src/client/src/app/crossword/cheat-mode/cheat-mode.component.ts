import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { GameService } from '../game.service';
import { TimerService } from '../services/timer.service';

@Component({
    selector: 'app-cheat-mode',
    templateUrl: './cheat-mode.component.html',
    styleUrls: ['./cheat-mode.component.css']
})
export class CheatModeComponent implements OnInit {

    @ViewChild('timerInput') private timerInput: ElementRef;

    constructor(private crosswordGameService: GameService,
                private timerService: TimerService) { }

    public ngOnInit() {
    }

    public onCheatModeToggle(): void {
        this.crosswordGameService.setCheatModeOnOff();
    }

    public isCheatModeOn(): boolean {
        return this.crosswordGameService.getCheatModeState();
    }

    public getCheatModeStateText(): string {
        if (this.isCheatModeOn()) {
            return 'Disable';
        }
        else {
            return 'Enable';
        }
    }

    public onShowWordsToggle(): void {
        this.crosswordGameService.setShowWordsOnOff();
    }

    public isShowWordsOn(): boolean {
        return this.crosswordGameService.getShowWordsState();
    }

    public getShowWordsStateText(): string {
        if (this.isShowWordsOn()) {
            return 'Hide words';
        }
        else {
            return 'Show words';
        }
    }

    public onTimerRunningToggle(): void {
        this.crosswordGameService.setTimerOnOff();
    }

    public isTimerBeingSet(): boolean {
        return this.crosswordGameService.getTimerState();
    }

    public getTimerStateText(): string {
        if (this.isTimerBeingSet()) {
            return 'Disable';
        }
        else {
            return 'Set time';
        }
    }

    public checkTimerInput(): void {
        let input: string = this.timerInput.nativeElement.value;
        input = input.replace(/[^0-9]/ig, '');
        this.timerInput.nativeElement.value = input;
    }

    public changeTimerValue(): void {
        this.checkTimerInput();
        this.timerService.timer.next(
            this.timerInput.nativeElement.value
        );
    }

}
