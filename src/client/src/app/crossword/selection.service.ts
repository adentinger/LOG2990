import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Definition } from './definition-field/definition';
import { SelectedGridWord } from './board/selected-grid-word';
import { PacketManagerClient } from '../packet-manager-client';
import { SelectedWordPacket } from '../../../../common/src/crossword/packets/selected-word.packet';
import '../../../../common/src/crossword/packets/selected-word.parser';
import { PacketHandler, PacketEvent } from '../../../../common/src/index';

@Injectable()
export class SelectionService {

    public static readonly NO_SELECTION = new SelectedGridWord();

    private selectionValueInternal = new SelectedGridWord();
    private selectionSubject = new Subject<SelectedGridWord>();
    private serverSubscription: Subscription;

    constructor(private packetManager: PacketManagerClient) {
        this.selectionSubject.subscribe((selection) => {
            this.selectionValueInternal = selection;
        });
        this.serverSubscription = this.selectionSubject.subscribe((selection) => {
            this.sendSelectionToServer();
        });
    }

    public get selection(): Subject<SelectedGridWord> {
        return this.selectionSubject;
    }

    public get hasSelectedWord(): boolean {
        return this.selectionValueInternal !== SelectionService.NO_SELECTION;
    }

    public get selectionValue(): SelectedGridWord {
        return this.selectionValueInternal;
    }

    public isDefinitionSelected(definition: Definition): boolean {
        return this.selectionValue.playerSelection != null &&
               definition.index === this.selectionValue.playerSelection.id &&
               definition.direction === this.selectionValue.playerSelection.direction;
    }

    public updateSelectedGridWord(word: GridWord): void {
        this.selectionSubject.next(new SelectedGridWord(word, this.selectionValueInternal.opponentSelection));
    }

    @PacketHandler(SelectedWordPacket)
    private opponentSelected(event: PacketEvent<SelectedWordPacket>): void {
        this.serverSubscription.unsubscribe();
        // TODO update selection
        this.serverSubscription = this.selectionSubject.subscribe((selection) => {
            this.sendSelectionToServer();
        });
    }

    private sendSelectionToServer(): void {
        const selection = this.selectionValue.playerSelection;
        this.packetManager.sendPacket(
            SelectedWordPacket,
            new SelectedWordPacket(selection.direction, selection.id)
        );
    }

}
