import { Word } from './word';
import { GridFiller } from './grid-filler';

export enum Difficulty {easy, normal, hard}

export class Grid {
    public across: Word[] = [];
    public vertical: Word[] = [];

    public async fillUsing(filler: GridFiller): Promise<void> {
        await filler.fill(this);
    }

    public doesWordAlreadyExists(word: Word) {
        return this.across.findIndex((acrossWord) => acrossWord.equals(word)) >= 0 ||
               this.vertical.findIndex((verticalWord) => verticalWord.equals(word)) >= 0;
    }

}
