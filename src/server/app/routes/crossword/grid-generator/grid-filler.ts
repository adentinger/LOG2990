import { Word } from './word';
import { WordCaller } from './word-caller';
import { GridGenerator } from './grid-generator';
import { lexicon } from './englishWords';


export const WORD_SEARCH_MAX_ATTEMPT = 200;
export enum column { first, second, third }
export enum row { first, second, third }

export abstract class GridFiller {

    public async fill(): Promise<void> {
        await null;
    }

}

