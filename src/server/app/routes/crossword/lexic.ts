import { Db, Collection, Cursor } from 'mongodb';

import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';
import { WordConstraint } from '../../common/lexic/word-constraint';
import { HttpStatus } from '../../http-response-status';

export interface WordDocument {
    _id: string;
    value: string;
    frequency: number;
}

export class Lexic {
    public static readonly LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';
    public static readonly COMMONALITY_FREQUENCY_THRESHOLD = 1000;
    private wordCollection: Collection<WordDocument> = null;

    constructor(private databaseProvider: Promise<Db>,
        private regexBuilder: RegexBuilder,
        private externalWordApiService: ExternalWordApiService) {
        this.getCollection().then((wordCollection: Collection<WordDocument>) => {
            this.wordCollection = wordCollection;
        });
    }

    private getCollection(): Promise<Collection<WordDocument>> {
        return this.databaseProvider.then((db: Db) => {
            return db.collection<WordDocument>(Lexic.LEXIC_WORDS_COLLECTION);
        });
    }

    private fetchWords(constraint: WordConstraint, resolve: (value: string[]) => void, reject: (reason?: any) => void) {
        const REGEX = this.regexBuilder.buildFromConstraint(constraint);
        if (REGEX === null) {
            reject(HttpStatus.BAD_REQUEST);
            return;
        }

        const SEARCH_OPTION = { value: { $regex: REGEX } };
        if ('isCommon' in constraint && constraint.isCommon !== null) {
            SEARCH_OPTION['frequency'] = constraint.isCommon ?
                { $gte: Lexic.COMMONALITY_FREQUENCY_THRESHOLD } :
                { $lt: Lexic.COMMONALITY_FREQUENCY_THRESHOLD };
        }
        const CURSOR: Cursor<any> = this.wordCollection.find(SEARCH_OPTION, { value: true })
            .map((value: WordDocument) => value.value);
        CURSOR.toArray().then((words: string[]) => {
            if (words.length === 0) {
                throw HttpStatus.NOT_FOUND;
            }
            resolve(words);
        }).catch(reject);
    }

    public getWords(constraint: WordConstraint): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.databaseProvider.then((db: Db) => {
                if (this.wordCollection !== null) {
                    this.fetchWords(constraint, resolve, reject);
                } else {
                    this.getCollection()
                        .then((wordCollection: Collection<WordDocument>) => {
                            this.wordCollection = wordCollection;
                            this.fetchWords(constraint, resolve, reject);
                        }).catch(reject);
                }
            });
        });
    }

    public getDefinitions(word: string): Promise<string[]> {
        return this.externalWordApiService.getDefinitions(word);
    }

}
