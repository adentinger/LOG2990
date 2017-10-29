import { Injectable, EventEmitter } from '@angular/core';

import { Definition as SerializedDirection } from '../../../../../common/src/crossword/definition';
import { Definition } from './definition';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import { PacketManagerClient } from '../../packet-manager-client';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

import '../../../../../common/src/crossword/packets/game-definition.parser';

/**
 * Contains the crossword's definitions, and the answers if cheat mode.
 */
@Injectable()
export class DefinitionsService {

    public horizontalDefinitions: Map<number, Definition> = new Map();
    public verticalDefinitions: Map<number, Definition> = new Map();
    private answersInternal: string[];

    constructor(private packetManager: PacketManagerClient) {

        registerHandlers(this, this.packetManager);
        this.answersInternal = ['a', 'b', 'b', 'c', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'c', 'a', 'b'];
    }

    public get answers(): string[] {
        return this.answersInternal;
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
