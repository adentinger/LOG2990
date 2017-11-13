import { AbstractGridGenerator } from './abstract-grid-generator';

export class GridGenerator extends AbstractGridGenerator {

    private static readonly INSTANCE = new GridGenerator();

    public static getInstance(): GridGenerator {
        return GridGenerator.INSTANCE;
    }

    protected constructor() {
        super();
    }

}
