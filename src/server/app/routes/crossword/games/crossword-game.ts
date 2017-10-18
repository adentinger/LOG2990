import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { GridWord } from '../../../common/crossword/grid-word';
import { DEFINITIONS_MOCK } from '../mocks/definitions-mock';
import { ARRAY_GRIDWORD } from '../mocks/gridwords-mock';
import { Definition } from '../../../common/crossword/definition';
import { Direction } from '../../../common/crossword/crossword-enums';
import { PacketManagerServer } from '../../../packet-manager';
import { CrosswordTimerPacket } from '../../../common/crossword/packets/crossword-timer.packet';
import '../../../common/crossword/packets/crossword-timer.parser';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../common/index';

export class CrosswordGame {
    public countdown = 10000;
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    public horizontalGrid: GridWord[] = [];
    public verticalGrid: GridWord[] = [];

    public horizontalGridWords: Map<number, GridWord> = new Map();
    public verticalGridWords: Map<number, GridWord> = new Map();

    // public horizontalDefinitions: Definition[] = [];
    // public verticalDefinitions: Definition[] = [];
    public verticalDefinitions: Map<number, Definition> = new Map;
    public horizontalDefinitions: Map<number, Definition> = new Map;
    // public definitions: string;
    private gameMode: string;

    public player1Id: string = null;
    public player2Id: string = null;

    constructor(configs: CrosswordGameConfigs) {
        this.gameMode = configs.gameMode;

        // MOCK : will get gridwords from gridstore by http
        for (let i = 0; i < ARRAY_GRIDWORD.length; i++) {
            if (ARRAY_GRIDWORD[i].direction === Direction.horizontal) {
                this.horizontalGridWords.set(i, ARRAY_GRIDWORD[i]);
            } else {
                this.verticalGridWords.set(i, ARRAY_GRIDWORD[i]);
            }
            this.horizontalGridWords.set(i, ARRAY_GRIDWORD[i]);
        }
        for (let i = 0; i < ARRAY_GRIDWORD.length; i++) {
            this.horizontalGridWords.set(i, ARRAY_GRIDWORD[i]);
        }

        /// MOCK : will get definitions from lexic by http requests
        for (let i = 0; i < DEFINITIONS_MOCK.length; i++) {
            this.verticalDefinitions.set(i, DEFINITIONS_MOCK[i]);
        }
        for (let i = 0; i < DEFINITIONS_MOCK.length; i++) {
            this.horizontalDefinitions.set(i, DEFINITIONS_MOCK[i]);
        }

        // this.horizontalDefinitions = DEFINITIONS_MOCK;
        // this.verticalDefinitions = DEFINITIONS_MOCK;
        // console.log('new state of the game: ' + JSON.stringify(this.getGameInfo()));

        this.packetManager.registerDisconnectHandler((socketId: string) => {
            if (this.player1Id === socketId) {
                this.player1Id = null;
                // And warn the other player
            }
            if (this.player2Id === socketId) {
                this.player2Id = null;
                // And warn the other player
            }
        });

        registerHandlers(this, this.packetManager);

        this.startTimer();
    }

    public getGameInfo(): Object {
        return {
            'player1Id': this.player1Id,
            'player2Id': this.player2Id,
            'numberOfGridWords': this.getNumberOfWordsInGrid(),
            'numberOfDefinitions': this.getNumberOfDefinitions(),
        };
    }

    private getNumberOfDefinitions(): number {
        return this.horizontalDefinitions.size
            + this.verticalDefinitions.size;
    }

    private getNumberOfWordsInGrid(): number {
        return this.horizontalGrid.length
            + this.verticalGrid.length;
    }

    private startTimer() {
        setInterval(() => {
            if (this.player1Id !== null) {
                this.countdown--;
                console.log('hello this is the timer');
                this.packetManager.sendPacket(CrosswordTimerPacket, new CrosswordTimerPacket(this.countdown), this.player1Id);
            }
        }, 1000);
    };

    @PacketHandler(CrosswordTimerPacket)
    private getCheatModeTimerValue(event: PacketEvent<CrosswordTimerPacket>) {
        this.countdown = event.value.countdown;
    }
}
