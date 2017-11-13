import { AbstractGridGenerator } from './abstract-grid-generator';

export class GridMutator extends AbstractGridGenerator {

    private static readonly _INSTANCE = new GridMutator();

    public static getInstance(): GridMutator {
        return GridMutator._INSTANCE;
    }

    protected constructor() {
        super();
    }

}
