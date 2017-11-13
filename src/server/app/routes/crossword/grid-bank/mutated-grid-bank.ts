import { Grid } from '../grid-generator/grid';
import { GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

export class MutatedGridBank {

    public async getMutatedGridOfGame(gameId: GameId): Promise<Grid> {
        return null;
    }

    public updateMutatedGrid(foundWords: GridWord[]): void {
        return null;
    }

}
