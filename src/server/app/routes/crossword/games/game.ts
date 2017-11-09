import { CrosswordGameConfigs, PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Owner, Direction } from '../../../../../common/src/crossword/crossword-enums';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { GameData } from './game-data';
import { CommunicationHandler } from './communication-handler';
import { Player } from './player';
import { PacketHandler, PacketEvent } from '../../../../../common/src/communication';
import { SelectedWordPacket } from '../../../../../common/src/crossword/packets';

export abstract class Game {

    private static idCounter = 0;

    public readonly id: GameId;

    protected readonly initialized: Promise<void>;
    protected started = false;

    protected readonly dataInternal: GameData = new GameData();
    protected readonly players: Player[] = [];
    protected readonly maxPlayers: PlayerNumber;
    protected readonly configurationInternal: CrosswordGameConfigs;
    protected communicationHandler: CommunicationHandler;
    protected timerInterval: NodeJS.Timer = null;

    constructor(configs: CrosswordGameConfigs) {
        this.communicationHandler = new CommunicationHandler();
        this.configurationInternal = configs;

        this.id = Game.idCounter++;
        this.maxPlayers = configs.playerNumber;

        this.initialized =
            this.data.initialize(configs.difficulty).catch((reason) => console.log(reason));
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
        }
        return this.players.length;
    }

    public deletePlayerBySocketid(socketId: string): void {
        const index =
            this.players.findIndex((existingPlayer) => existingPlayer.socketId === socketId);
        const found = index >= 0;
        if (found) {
            this.players.splice(index, 1);
            // Stop countdown
            if (this.timerInterval !== null) {
                this.players.forEach(player => {
                    this.communicationHandler.sendNewTimerValueTo(player, 0);
                });
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

    public validateUserAnswer(wordGuess: GridWord, socketId: string): void {
        const DIRECTION = wordGuess.direction;
        const STRING = wordGuess.string;

        const FOUND = this.dataInternal.words.findIndex(
            (word) => {
                return word.direction === DIRECTION &&
                    word.string === STRING;
            }) >= 0;
        if (FOUND) {
            this.sendWordFound(wordGuess, socketId);
        }
    }

    protected notifyArrival(player: Player): void {
        this.players.forEach((existingPlayer) => {
            this.communicationHandler.notifyArrival(this.id, existingPlayer, player);
        });
    }

    protected sendWordFound(foundWord: GridWord, finderId: string): void {
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

    protected start(): void {
        if (!this.started) {
            this.started = true;
            this.players.forEach((player) => {
                this.communicationHandler.sendGameStart(this.players);
            });
        }
    }

    @PacketHandler(SelectedWordPacket)
    // tslint:disable-next-line:no-unused-variable
    private selectedWordHandler(event: PacketEvent<SelectedWordPacket>): void {
        if (this.isSocketIdInGame(event.socketid)) {
            const foundPlayer =
                this.findPlayer(player => player.socketId === event.socketid);
            if (foundPlayer != null) {
                this.updateSelectionOf(foundPlayer, event.value.id, event.value.direction);
            }
        }
    }

}
