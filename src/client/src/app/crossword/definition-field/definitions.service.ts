import { Injectable, EventEmitter } from '@angular/core';

import { Definition as SerializedDirection } from '../../../../../common/src/crossword/definition';
import { Definition } from './definition';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import { PacketManagerClient } from '../../packet-manager-client';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

import '../../../../../common/src/crossword/packets/game-definition.parser';

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

    @PacketHandler(GameDefinitionPacket)
    public gameDefinitionHandler(event: PacketEvent<GameDefinitionPacket>) {

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
        console.log('Definition Added');

        // TODO update game definitions with incomming definition
    }

}
