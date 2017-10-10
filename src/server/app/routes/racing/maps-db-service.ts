import { Db, Collection, MongoError } from 'mongodb';

import { SerializedMap } from '../../common/racing/serialized-map';
import { HttpStatus } from '../../http-response-status';

export class MapDbService {

    public static readonly COLLECTION = 'racing-maps';

    // TODO Change 'any' to an interface.
    public mapCollection: Collection<any>;

    constructor(private dbPromise: Promise<Db>) {
        dbPromise.then((db: Db) => {
            db.collection(MapDbService.COLLECTION, (error: MongoError, mapCollection: Collection<any>) => {
                this.mapCollection = mapCollection;
            });
        });
    }

    public saveNew(serializedMap: SerializedMap): Promise<number> {
        console.log(new Error('Not implemented'));
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public saveEdited(serializedMap: SerializedMap): Promise<void> {
        console.log(new Error('Not implemented'));
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
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
