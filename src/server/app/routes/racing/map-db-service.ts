import { Db, Collection, MongoError, FindAndModifyWriteOpResultObject } from 'mongodb';

import { SerializedMap } from '../../common/racing/serialized-map';
import { HttpStatus } from '../../common';

export class MapDbService {

    public static readonly COLLECTION = 'racing-maps';
    public static readonly VALID_MAP_NAMES_MATCHER = /^\S.*\S?$/i;

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
            serializedMap.name = serializedMap.name.trim();
            if (serializedMap.name == null ||
                !MapDbService.VALID_MAP_NAMES_MATCHER.test(serializedMap.name)) {
                reject(HttpStatus.BAD_REQUEST);
                return;
            }

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
            if (serializedMap.name == null) {
                reject(HttpStatus.BAD_REQUEST);
                return;
            }

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
        return new Promise((resolve, reject) => {
            this.mapCollection.findOneAndDelete({name: name})
            .then((result: FindAndModifyWriteOpResultObject) => {
                if (result.value) {
                    resolve();
                }
                else {
                    reject(HttpStatus.NOT_FOUND);
                }
            })
            .catch((reason) => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    }

    public getMapNames(count: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.mapCollection.find({}, {_id: false, name: true}).toArray()
            .then((nameObjects: any[]) => {
                const NAMES: string[] = nameObjects.map((nameObject: any) => nameObject.name);
                if (NAMES.length > count) {
                    NAMES.splice(count);
                }
                resolve(NAMES);
            })
            .catch(() => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
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