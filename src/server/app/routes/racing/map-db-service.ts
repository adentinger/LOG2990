import { Db, Collection, MongoError, FindAndModifyWriteOpResultObject } from 'mongodb';

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
            const MAP_DOCUMENT: any = this.makeMapDocumentFrom(serializedMap);

            this.mapCollection.insertOne(MAP_DOCUMENT)
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
            const MAP_DOCUMENT: any = this.makeMapDocumentFrom(serializedMap);

            this.mapCollection.findOneAndReplace({_id: MAP_DOCUMENT._id}, MAP_DOCUMENT)
            .then((result: FindAndModifyWriteOpResultObject) => {
                if (result.value) {
                    resolve();
                }
                else {
                    reject(HttpStatus.NOT_FOUND);
                }
            })
            .catch(() => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
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
        return new Promise((resolve, reject) => {
            this.mapCollection.findOne({_id: name})
            .then((mapDocument) => {
                if (mapDocument) {
                    resolve(this.makeSerializedMapFrom(mapDocument));
                }
                else {
                    reject(HttpStatus.NOT_FOUND);
                }
            })
            .catch(() => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    }

    private makeMapDocumentFrom(serializedMap: SerializedMap): any {
        const MAP_DOCUMENT: any = serializedMap;
        MAP_DOCUMENT._id = serializedMap.name;
        return MAP_DOCUMENT;
    }

    private makeSerializedMapFrom(mapDocument: any): SerializedMap {
        // tslint:disable-next-line:no-unused-variable
        const {_id: ID, ...SERIALIZED_MAP} = mapDocument;
        return SERIALIZED_MAP;
    }

}
