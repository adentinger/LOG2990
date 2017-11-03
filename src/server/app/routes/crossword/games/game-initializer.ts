export class GameInitializer {

    private static readonly instance = new GameInitializer();

    public static getInstance(): GameInitializer {
        return GameInitializer.instance;
    }

    private constructor() {}

}
