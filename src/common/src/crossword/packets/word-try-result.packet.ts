import { GridWord } from '../grid-word';

/**
 * @class WordTryResultPacket
 * @description Represents the result of a word try.
 * If the word is found, 'found' is set to true, and
 * 'word' is set to the word to replace.
 * Otherwise, 'found' is set to false, and 'word' is null.
 */
export class WordTryResultPacket  {

    constructor(public found?: boolean,
                public word?: GridWord) { }

}
