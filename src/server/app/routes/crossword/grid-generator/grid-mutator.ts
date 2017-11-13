import { AbstractGridGenerator } from './abstract-grid-generator';

export class GridMutator extends AbstractGridGenerator {

    private static readonly INSTANCE = new GridMutator();

    public static getInstance(): GridMutator {
        return GridMutator.INSTANCE;
    }

    protected constructor() {
        super();
    }

}
