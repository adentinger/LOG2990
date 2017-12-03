import { MapDbService } from './map-db-service';
import { provideDatabase } from '../../app-db';

export class MapUpdater {

    protected static readonly instance = new MapUpdater();

    private readonly MAP_DB_SERVICE =
        new MapDbService(provideDatabase());

    public static getInstance(): MapUpdater {
        return MapUpdater.instance;
    }

    protected constructor() {}

    public updateTime(mapName: string, time: number): Promise<void> {
        return this.MAP_DB_SERVICE.getMapProperty(mapName, {_id: false, bestTimes: true}).then((mapFields) => {
            console.log('Updated ' + mapName + '\'s time: ' + time + ' sec');
            console.log('best times:', mapFields['bestTimes']);
        });
    }

    public updateRating(mapName: string, rating: number): Promise<void> {
        return this.MAP_DB_SERVICE.getMapProperty(mapName, {_id: false, sumRatings: true, numberOfRatings: true}).then((mapFields) => {
            console.log('Updated ' + mapName + '\'s rating: ' + rating + ' / 5');
            console.log('sumRatings: ', mapFields['sumRatings'], 'numberOfRatings:', mapFields['numberOfRatings']);
        });
    }

}
