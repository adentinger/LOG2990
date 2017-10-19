import { Injectable, EventEmitter } from '@angular/core';

import { Definition } from '../../common/crossword/definition';
// import { DEFINITIONS_MOCK } from '../mocks/definition-mock';
import { CrosswordGameService } from '../crossword-game.service';
import { CrosswordGridService } from '../board/crossword-grid.service';
import { PacketHandler, PacketEvent, registerHandlers } from '../../common/index';
import { GameDefinitionPacket } from '../../common/crossword/packets/game-definition.packet';
import { PacketManagerClient } from '../../packet-manager-client';
import { Direction } from '../../common/crossword/crossword-enums';

import '../../common/crossword/packets/game-definition.parser';

@Injectable()
export class DefinitionsService {
    public horizontalDefinitions: Map<number, Definition> = new Map();
    public verticalDefinitions: Map<number, Definition> = new Map();
    private answers: string[];

    public internalSelectedDefinitionId: number = -1;
    public internalSelectedDefinition: EventEmitter<number> = new EventEmitter<number>();
    public internalSelectedDirection: Direction;

    public getDefinitions(): Definition[] {
        return [...this.horizontalDefinitions.values(), ...this.verticalDefinitions.values()];
    }

    constructor(public crosswordGameService: CrosswordGameService,
        public crosswordGridService: CrosswordGridService,
        private packetManager: PacketManagerClient) {

        // this.horizontalDefinitions = new Map(
        //     DEFINITIONS_MOCK.map(
        //         (definition: Definition, id: number) =>
        //             <[number, Definition]>[id, definition]));
        // this.verticalDefinitions = new Map(
        //     DEFINITIONS_MOCK.map(
        //         (definition: Definition, id: number) =>
        //             <[number, Definition]>[id, definition]));

        registerHandlers(this, this.packetManager);
        this.answers = ['a', 'b', 'b', 'c', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'c', 'a', 'b'];
    }

    public getAnswers(): string[] {
        return this.answers;
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

    public get selectedDirection() {
        return this.internalSelectedDirection;
    }

    public set selectedDirection(selectedDirection) {
        this.internalSelectedDirection = selectedDirection;
    }

    public onSelect(index: number, direction: Direction, event): void {
        if (this.crosswordGridService.grid[index].string === '') {

            this.selectedDefinitionId = index;
            this.crosswordGameService.selectedWordIndex = index;
            this.crosswordGameService.lastSelectedWordIndex = index;
            this.selectedDirection = direction;

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
        const direction = event.value.direction;
        if (direction === Direction.horizontal) {
            this.horizontalDefinitions.set(definitionIndex, definition);
        } else if (direction === Direction.vertical) {
            this.verticalDefinitions.set(definitionIndex, definition);
        }
        console.log('Definition Added');

        // TODO update game definitions with incomming definition
    }
}
