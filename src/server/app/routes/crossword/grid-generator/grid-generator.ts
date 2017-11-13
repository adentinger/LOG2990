import { AbstractGridGenerator } from './abstract-grid-generator';

export class GridGenerator extends AbstractGridGenerator {

    private static readonly _INSTANCE = new GridGenerator();

    public static getInstance(): GridGenerator {
        return GridGenerator._INSTANCE;
    }

    protected constructor() {
        super();
    }

}
