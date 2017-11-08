import { GridWord } from '../../../../../common/src/crossword/grid-word';

export class SelectedGridWord {
    constructor(public playerSelection: GridWord = null, public opponentSelection: GridWord = null) {}
}
