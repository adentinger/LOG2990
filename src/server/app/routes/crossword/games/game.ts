import { CrosswordGameConfigs, PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { PacketManagerServer } from '../../../packet-manager';
import { registerHandlers } from '../../../../../common/src/index';
import { GameMode, Owner, Direction } from '../../../../../common/src/crossword/crossword-enums';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { GameData } from './game-data';
import { CommunicationHandler } from './communication-handler';
import { Player } from './player';

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 hour

export class Game {

    private static readonly COUNTDOWN_INITAL = COUNTDOWN_DEFAULT_VALUE;
    private static idCounter = 0;

    public readonly id: GameId;
    public countdown = Game.COUNTDOWN_INITAL;

    private readonly initialized: Promise<void>;
    private started = false;
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();
    private readonly dataInternal: GameData = new GameData();
    private readonly players: Player[] = [];
    private readonly maxPlayers: PlayerNumber;
    private readonly configurationInternal: CrosswordGameConfigs;
    private communicationHandler: CommunicationHandler;
    private timerInterval: NodeJS.Timer = null;

    constructor(configs: CrosswordGameConfigs) {
        this.communicationHandler = new CommunicationHandler();
        this.configurationInternal = configs;

        this.id = Game.idCounter++;
        this.maxPlayers = configs.playerNumber;

        this.initialized =
            this.data.initialize(configs.difficulty).catch((reason) => console.log(reason));

        registerHandlers(this, this.packetManager);
    }

    public get data(): GameData {
        return this.dataInternal;
    }

    public get configuration(): CrosswordGameConfigs {
        const config: CrosswordGameConfigs = {
            difficulty: this.configurationInternal.difficulty,
            gameId: this.id,
            gameMode: this.configurationInternal.gameMode,
            playerNumber: this.maxPlayers,
            playerName: this.players.length > 0 ? this.players[0].name : ''
        };
        return config;
    }

    public get currentNumberOfPlayers(): number {
        return this.players.length;
    }

    public addPlayer(player: Player): PlayerNumber {
        if (this.players.length < this.maxPlayers) {
            this.notifyArrival(player);

            // Actually add player
            this.players.push(player);
            this.initialized.then(() => {
                this.communicationHandler.clearPlayerGrid(player.socketId);
                this.communicationHandler.sendGridWords(player.socketId, this.dataInternal.emptyWords);
                this.communicationHandler.sendDefinitions(player.socketId, this.dataInternal.definitions);
            }).catch((reason) => console.log(reason));

            // Start game if max players reached.
            if (this.players.length === this.maxPlayers) {
                this.start();
            }
            return this.players.length;
        }
        else {
            throw new Error('Cannot add a new player: max number reached.');
        }
    }

    public deletePlayerBySocketid(socketId: string): void {
        const index =
            this.players.findIndex((existingPlayer) => existingPlayer.socketId === socketId);
        const found = index >= 0;
        if (found) {
            this.players.splice(index, 1);
            if (this.timerInterval !== null) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }
        else {
            throw new Error(`Cannot delete player with socket ID ${socketId}: no such player.`);
        }
    }

    public findPlayer(predicate: (player: Player) => boolean): Player {
        return this.players.find(predicate);
    }

    public matchesFilter(filter: GameFilter): boolean {
        return this.configurationInternal.gameMode === filter.mode &&
               this.maxPlayers === filter.playerNumber;
    }

    public validateUserAnswer(wordTry: GridWord, socketId: string): void {
        const DIRECTION = wordTry.direction;
        const STRING = wordTry.string;

        const FOUND = this.dataInternal.words.findIndex(
            (word) => {
                return word.direction === DIRECTION &&
                       word.string === STRING;
            }) >= 0;
        if (FOUND) {
            this.sendWordFound(wordTry, socketId);
        }
    }

    private notifyArrival(player: Player): void {
        this.players.forEach((existingPlayer) => {
            this.communicationHandler.notifyArrival(this.id, existingPlayer, player);
        });
    }

    private sendWordFound(foundWord: GridWord, finderId: string): void {
        foundWord.owner = Owner.player1;
        const finderPlayer =
            this.players.find(player => player.socketId === finderId);
        const opponent =
            this.players.find((player) => player.socketId !== finderId);
        this.communicationHandler.sendFoundWord(foundWord, finderPlayer, opponent);
    }

    public updateSelectionOf(player: Player, id: number, direction: Direction): void {
        const opponents = this.players.filter(
            (existingPlayer) => existingPlayer.socketId !== player.socketId
        );
        opponents.forEach((opponent) => {
            this.communicationHandler.updateOpponentSelectionOf(opponent, id, direction);
        });
    }

    public isSocketIdInGame(socketId: string): boolean {
        return this.players.findIndex((id) => id.socketId === socketId) >= 0;
    }

    private start(): void {
        if (!this.started) {
            this.started = true;
            this.players.forEach((player) => {
                this.communicationHandler.sendGameStart(this.players);
            });
            if (this.configurationInternal.gameMode === GameMode.Dynamic) {
                this.startTimer();
            }
        }
        else {
            throw new Error('Cannot start game: Game already started.');
        }
    }

    private startTimer() {
        const ONE_SECOND = 1000;
        this.timerInterval = setInterval(() => {
            this.countdown--;
            this.players.forEach((player) => {
                this.communicationHandler.sendNewTimerValueTo(player, this.countdown);
            });
        }, ONE_SECOND);
    };

}
