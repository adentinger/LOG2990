import { Injectable, EventEmitter } from '@angular/core';

import { Definition } from '../../common/crossword/definition';
import { DEFINITIONS_MOCK } from '../mocks/definition-mock';
import { CrosswordGameService } from '../crossword-game.service';
import { CrosswordGridService } from '../board/crossword-grid.service';
import { PacketHandler, PacketEvent, registerHandlers } from '../../common/index';
import { GameDefinitionPacket } from '../../common/crossword/packets/game-definition.packet';
import { PacketManagerClient } from '../../packet-manager-client';

@Injectable()
export class DefinitionsService {

    private cheatModeOn = false;
    private changeTimerValueOn = false;
    private timerValueInSeconds: number;
    private definitions: Definition[];
    public internalSelectedDefinitionId: number = -1;
    public internalSelectedDefinition: EventEmitter<number> = new EventEmitter<number>();

    public getDefinitions(): Definition[] {
        return this.definitions;
    }
    constructor(public crosswordGameService: CrosswordGameService,
        public crosswordGridService: CrosswordGridService,
        private packetManager: PacketManagerClient) {
        this.definitions = DEFINITIONS_MOCK;
        registerHandlers(this, this.packetManager);
    }

    public get selectedDefinitionId() {
        return this.internalSelectedDefinitionId;
    }

    public set selectedDefinitionId(selectedDefinitionId) {
        this.internalSelectedDefinitionId = selectedDefinitionId;

        if (selectedDefinitionId === -1) {
            this.internalSelectedDefinition.emit(null);
        }
        else {
            this.internalSelectedDefinition.emit(selectedDefinitionId);
        }
    }

    public onSelect(index: number, event): void {
        if (this.crosswordGridService.grid[index].string === '') {

            this.selectedDefinitionId = index;
            this.crosswordGameService.selectedWordIndex = index;
            this.crosswordGameService.lastSelectedWordIndex = index;

            this.crosswordGameService.aDefinitionIsSelected = true;
        }
    }

    public onClickOutside(): void {
        this.selectedDefinitionId = -1;
        this.crosswordGameService.selectedWordIndex = 0;

        this.crosswordGameService.aDefinitionIsSelected = false;
    }

    @PacketHandler(GameDefinitionPacket)
    public gameDefinitionHandler(event: PacketEvent<GameDefinitionPacket>) {
        const definitionIndex = event.value.index;
        const definition = event.value.definition;

        // TODO update game definitions with incomming definition
    }
    ////////////// Cheat Mode //////////////

    public getCheatModeState(): boolean {
        return this.cheatModeOn;
    }

    public getCheatModeStateText(): string {
        if (this.cheatModeOn) {
            return 'On';
        }
        else {
            return 'Off';
        }
    }

    public setCheatModeOnOff(): void {
        this.cheatModeOn = !this.cheatModeOn;
    }

    public getTimerState(): boolean {
        return this.changeTimerValueOn;
    }

    public getTimerStateText(): string {
        if (this.changeTimerValueOn) {
            return 'On';
        }
        else {
            return 'Off';
        }
    }

    public setTimerOnOff(): void {
        this.changeTimerValueOn = !this.changeTimerValueOn;
    }

    // not done
    public changeTimerValue(seconds: number): void {
        this.timerValueInSeconds = seconds;
    }
}
