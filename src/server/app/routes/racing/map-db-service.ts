import { Db, Collection, MongoError } from 'mongodb';

import { SerializedMap } from '../../common/racing/serialized-map';
import { HttpStatus } from '../../http-response-status';

export class MapDbService {

    public static readonly COLLECTION = 'racing-maps';

    public mapCollection: Collection;

    constructor(private dbPromise: Promise<Db>) {
        dbPromise.then((db: Db) => {
            db.collection(MapDbService.COLLECTION, (error: MongoError, mapCollection: Collection<any>) => {
                this.mapCollection = mapCollection;
            });
        });
    }

    public saveNew(serializedMap: SerializedMap): Promise<void> {

        return new Promise((resolve, reject) => {
            const DOCUMENT_MAP: any = serializedMap;
            DOCUMENT_MAP._id = serializedMap.name;

            this.mapCollection.insertOne(DOCUMENT_MAP)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject(HttpStatus.CONFLICT);
            });
        });

    }

    public saveEdited(serializedMap: SerializedMap): Promise<void> {
        return new Promise((resolve, reject) => {

        });
    }

    public delete(name: string): Promise<void> {
        console.log(new Error('Not implemented'));
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public getMapNames(count: number): Promise<string[]> {
        console.log(new Error('Not implemented'));
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public getByName(name: string): Promise<SerializedMap> {
        console.log(new Error('Not implemented'));
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

}
