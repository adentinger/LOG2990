import { CrosswordGameConfigs } from '../../../common/communication/game-configs';
import { GridWord } from '../../../common/crossword/grid-word';
import { DEFINITIONS_MOCK } from '../mocks/definitions-mock';
import { Definition } from '../../../common/crossword/definition';
import { PacketManagerServer } from '../../../packet-manager';
import { CrosswordTimerPacket } from '../../../common/crossword/packets/crossword-timer.packet';
import '../../../common/crossword/packets/crossword-timer.parser';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../common/index';

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 minute

export class CrosswordGame {
    public countdown = COUNTDOWN_DEFAULT_VALUE;
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    public horizontalGrid: GridWord[] = [];
    public verticalGrid: GridWord[] = [];

    public horizontalDefinitions: Definition[] = [];
    public verticalDefinitions: Definition[] = [];
    // public definitions: string;
    private gameMode: string;

    public player1Id: string = null;
    public player2Id: string = null;
    constructor(configs: CrosswordGameConfigs) {
        this.gameMode = configs.gameMode;
        // other attributes

        this.horizontalDefinitions = DEFINITIONS_MOCK;
        this.verticalDefinitions = DEFINITIONS_MOCK;
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
        return this.horizontalDefinitions.length
            + this.verticalDefinitions.length;
    }

    private getNumberOfWordsInGrid(): number {
        return this.horizontalGrid.length
            + this.verticalGrid.length;
    }

    private startTimer() {
        setInterval(() => {
            if (this.player1Id !== null) {
                this.countdown--;
                this.packetManager.sendPacket(CrosswordTimerPacket, new CrosswordTimerPacket(this.countdown), this.player1Id);
            }
        }, 1000);
    };

    @PacketHandler(CrosswordTimerPacket)
    private getCheatModeTimerValue(event: PacketEvent<CrosswordTimerPacket>) {
        this.countdown = event.value.countdown;
    }
}
