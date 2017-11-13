import { Grid } from '../grid-generator/grid';
import { GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

export class MutatedGridBank {

    private static readonly INSTANCE = new MutatedGridBank();

    public static getInstance(): MutatedGridBank {
        return MutatedGridBank.INSTANCE;
    }

    protected constructor() { }

    public async getMutatedGridOfGame(gameId: GameId): Promise<Grid> {
        return null;
    }

    public updateMutatedGrid(foundWords: GridWord[]): void {
        return null;
    }

}
