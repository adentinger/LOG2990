import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Definition } from './definition-field/definition';
import { SelectedGridWord, WordByIdAndDirection } from './board/selected-grid-word';
import { PacketManagerClient } from '../packet-manager-client';
import { SelectedWordPacket } from '../../../../common/src/crossword/packets/selected-word.packet';
import '../../../../common/src/crossword/packets/selected-word.parser';
import { PacketHandler, PacketEvent } from '../../../../common/src/index';
import { GridService } from './board/grid.service';
import { Direction } from '../../../../common/src/crossword/crossword-enums';

@Injectable()
export class SelectionService {

    public static readonly NO_SELECTION: WordByIdAndDirection = {id: -1, direction: Direction.horizontal};

    private selectionValueInternal =
        new SelectedGridWord(SelectionService.NO_SELECTION, SelectionService.NO_SELECTION);
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

    public get selectionValue(): SelectedGridWord {
        return this.selectionValueInternal;
    }

    public isDefinitionSelected(definition: Definition): boolean {
        return this.selectionValue.player != null &&
               definition.index === this.selectionValue.player.id &&
               definition.direction === this.selectionValue.player.direction;
    }

    public updateSelectedGridWord(word: WordByIdAndDirection): void {
        this.selectionSubject.next(
            new SelectedGridWord(word, this.selectionValueInternal.opponent)
        );
    }

    @PacketHandler(SelectedWordPacket)
    private opponentSelected(event: PacketEvent<SelectedWordPacket>): void {
        this.serverSubscription.unsubscribe();
        this.selectionSubject.next({
            player: this.selectionValue.player,
            opponent: {id: event.value.id, direction: event.value.direction}
        });
        this.serverSubscription = this.selectionSubject.subscribe((selection) => {
            this.sendSelectionToServer();
        });
    }

    private sendSelectionToServer(): void {
        const selection = this.selectionValue.player;
        this.packetManager.sendPacket(
            SelectedWordPacket,
            new SelectedWordPacket(selection.direction, selection.id)
        );
    }

}
