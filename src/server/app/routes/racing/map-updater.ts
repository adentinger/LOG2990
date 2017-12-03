import { MapDbService } from './map-db-service';
import { provideDatabase } from '../../app-db';
import { HttpStatus } from '../../../../common/src/index';

export class MapUpdater {

    protected static readonly instance = new MapUpdater();

    private readonly MAP_DB_SERVICE =
        new MapDbService(provideDatabase());

    public static getInstance(): MapUpdater {
        return MapUpdater.instance;
    }

    protected constructor() {}

    public updateTime(mapName: string, time: number): Promise<void> {
        return this.MAP_DB_SERVICE.getMapProperties(mapName, {_id: false, bestTimes: true}).then((mapFields) => {
            console.log('Updated ' + mapName + '\'s time: ' + time + ' sec');
            console.log('best times:', mapFields['bestTimes']);
        });
    }

    public updateRating(mapName: string, rating: number): Promise<void> {
        const RATING_MIN = 1;
        const RATING_MAX = 5;
        const roundedRating = Math.round(rating);
        const isRatingValid = roundedRating > RATING_MIN && roundedRating < RATING_MAX;

        if (isRatingValid) {
            return this.MAP_DB_SERVICE
                .getMapProperties(mapName, {_id: false, sumRatings: true, numberOfRatings: true})
                .then((mapFields) => {

                const sumRatings = mapFields['sumRatings'];
                const numberOfRatings = mapFields['numberOfRatings'];
                console.log('Updated ' + mapName + '\'s rating: ' + rating + ' / 5');
                console.log('sumRatings: ', sumRatings, 'numberOfRatings:', numberOfRatings);

            });
        }
        else {
            return Promise.reject(HttpStatus.BAD_REQUEST);
        }
    }

}
