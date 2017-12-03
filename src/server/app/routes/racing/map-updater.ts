import { MapDbService } from './map-db-service';
import { provideDatabase } from '../../app-db';
import { HttpStatus } from '../../../../common/src/index';

export class MapUpdater {

    private static readonly MAX_BEST_TIMES_SIZE = 5;
    private static readonly RATING_MIN = 1;
    private static readonly RATING_MAX = 5;

    protected static readonly instance = new MapUpdater();

    private readonly MAP_DB_SERVICE =
        new MapDbService(provideDatabase());

    public static getInstance(): MapUpdater {
        return MapUpdater.instance;
    }

    protected constructor() {}

    public incrementPlays(mapName: string): Promise<void> {
        return this.MAP_DB_SERVICE.getMapProperties(mapName, {_id: false, numberOfPlays: true}).then((mapFields) => {
            const numberOfPlays: number = mapFields['numberOfPlays'] + 1;

            return this.MAP_DB_SERVICE.setMapProperties(mapName, {numberOfPlays: numberOfPlays});
        });
    }

    public updateTime(mapName: string, time: number): Promise<void> {
        const isTimeValid = time > 0;
        if (isTimeValid) {
            return this.MAP_DB_SERVICE.getMapProperties(mapName, {_id: false, bestTimes: true}).then((mapFields) => {
                const bestTimes: number[] = mapFields['bestTimes'];

                bestTimes.push(time);
                bestTimes.sort();
                bestTimes.splice(MapUpdater.MAX_BEST_TIMES_SIZE);

                return this.MAP_DB_SERVICE.setMapProperties(mapName, {bestTimes: bestTimes});
            });
        }
        else {
            return Promise.reject(HttpStatus.BAD_REQUEST);
        }
    }

    public updateRating(mapName: string, rating: number): Promise<void> {
        const roundedRating = Math.round(rating);
        const isRatingValid = roundedRating >= MapUpdater.RATING_MIN && roundedRating <= MapUpdater.RATING_MAX;

        if (isRatingValid) {
            return this.MAP_DB_SERVICE
                .getMapProperties(mapName, {_id: false, sumRatings: true, numberOfRatings: true})
                .then((mapFields) => {

                const sumRatings = mapFields['sumRatings'] + rating;
                const numberOfRatings = mapFields['numberOfRatings'] + 1;

                return this.MAP_DB_SERVICE.setMapProperties(
                    mapName,
                    {sumRatings: sumRatings, numberOfRatings: numberOfRatings}
                );
            });
        }
        else {
            return Promise.reject(HttpStatus.BAD_REQUEST);
        }
    }

}
