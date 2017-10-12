import { Collection } from 'mongodb';
import { fetchCollection } from '../../app-db';

export interface Property<T = any> {
    name: string;
    value: T;
}

export class AdminDbService {
    public static readonly ADMIN_COLLECTION = 'admin-collection';
    private static instance: AdminDbService;

    private collectionPromise: Promise<Collection<Property>> = fetchCollection(AdminDbService.ADMIN_COLLECTION);

    public static get(): AdminDbService {
        if (!AdminDbService.instance) {
            AdminDbService.instance = new AdminDbService();
        }
        return AdminDbService.instance;
    }

    private constructor() { }

    public checkPassword(password: string): Promise<boolean> {
        const PROPERTY_NAME = 'password', DEFAULT_VALUE = 'admin';
        return this.collectionPromise.then((collection: Collection<Property>) => {
            return this.ensurePropertyInCollection<string>(PROPERTY_NAME, DEFAULT_VALUE, collection);
        }).then((property: Property<String>) => {
            return property.value === password;
        }).catch(() => false);
    }

    private ensurePropertyInCollection<T>(name: string, defaultValue: T,
        collection: Collection<Property<T>>): Promise<Property<T>> {
        const CURSOR = collection.find({ name });
        return CURSOR.count().then((count: number) => {
            if (count === 0) {
                return collection.insertOne({ _id: name, name: name, value: defaultValue })
                    .then((result) => {
                        if (result.insertedCount === 0) {
                            throw new Error(`Cannot insert default value for "${name}"`);
                        }
                        return collection.find({ name }).limit(1).next();
                    });
            }
            return CURSOR.limit(1).next();
        });
    }
}
