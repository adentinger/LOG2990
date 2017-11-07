import { Injectable } from '@angular/core';

import { Definition } from './definition';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { PacketManagerClient } from '../../packet-manager-client';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import { ClearGridPacket } from '../../../../../common/src/crossword/packets/clear-grid.packet';
import '../../../../../common/src/crossword/packets/clear-grid.parser';

export interface Answers {
    horizontal: string[];
    vertical: string[];
}

export interface Definitions {
    horizontal: Definition[];
    vertical: Definition[];
}

/**
 * Contains the crossword's definitions, and the answers if cheat mode.
 */
@Injectable()
export class DefinitionsService {

    private horizontalDefinitions: Map<number, Definition> = new Map();
    private verticalDefinitions: Map<number, Definition> = new Map();
    private horizontalAnswers: string[] = [];
    private verticalAnswers: string[] = [];
    private onChangeCallbacks: (() => void)[] = [];

    constructor(private packetManager: PacketManagerClient) {

        registerHandlers(this, this.packetManager);
        this.horizontalAnswers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        this.verticalAnswers = ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'];
    }

    public get answers(): Answers {
        return {
            horizontal: this.horizontalAnswers.slice(),
            vertical: this.verticalAnswers.slice()
        };
    }

    public get definitions(): Definitions {
        return {
            horizontal: <Definition[]>Array.from(this.horizontalDefinitions.values()),
            vertical: <Definition[]>Array.from(this.verticalDefinitions.values())
        };
    }

    public pushOnChangeCallback(callback: () => void): void {
        this.onChangeCallbacks.push(callback);
    }

    private onChange(): void {
        this.onChangeCallbacks.forEach((callback) => {
            callback();
        });
    }

    @PacketHandler(GameDefinitionPacket)
    // tslint:disable-next-line:no-unused-variable
    private gameDefinitionHandler(event: PacketEvent<GameDefinitionPacket>) {
        const definitionIndex = event.value.index;
        const serializedDefinition = event.value.definition;
        const direction = event.value.direction;
        const DEFINITION =
            Definition.deserialize(definitionIndex, serializedDefinition);

        if (direction === Direction.horizontal) {
            this.horizontalDefinitions.set(definitionIndex, DEFINITION);
        } else if (direction === Direction.vertical) {
            this.verticalDefinitions.set(definitionIndex, DEFINITION);
        }
        this.onChange();
    }

    @PacketHandler(ClearGridPacket)
    // tslint:disable-next-line:no-unused-variable
    private clearDefinitions(): void {
        this.horizontalDefinitions = new Map();
        this.verticalDefinitions = new Map();
        this.horizontalAnswers = [];
        this.verticalAnswers = [];
        this.onChange();
    }

}
