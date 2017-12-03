export class MapUpdater {

    protected readonly instance = new MapUpdater();

    protected constructor() {}

    public updateTime(mapName: string, time: number): Promise<void> {
        console.log('Updated' + mapName + '\'s time:' + time);
        return Promise.resolve();
    }

    public updateRating(mapName: string, rating: number): Promise<void> {
        console.log('Updated' + mapName + '\'s rating:' + rating);
        return Promise.resolve();
    }

}
