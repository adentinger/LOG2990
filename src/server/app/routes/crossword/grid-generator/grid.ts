import { Word } from './word';
import { GridFiller } from './grid-filler';

export enum Difficulty {easy, normal, hard}

export class Grid {
    public across: Word[] = [];
    public vertical: Word[] = [];

    public isCurrentlyValid(): boolean {
        return false;
    }

    public async fillUsing(filler: GridFiller): Promise<void> {
        await(filler.fill(this));
    }

}
