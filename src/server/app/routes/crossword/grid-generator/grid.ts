import { Word } from './word';
import { GridFiller } from './grid-filler';

export class Grid {
    public across: Word[] = [];
    public vertical: Word[] = [];

    public async fillUsing(filler: GridFiller): Promise<void> {
        await filler.fill(this);
    }

    public doesWordAlreadyExist(word: string): boolean {
        return this.across.findIndex((acrossWord) => acrossWord.value === word) >= 0 ||
               this.vertical.findIndex((verticalWord) => verticalWord.value === word) >= 0;
    }

}
