import { AbstractGridGenerator } from './abstract-grid-generator';
import { Grid } from './grid';
import { Word } from './word';

/**
 * @class GridMutator
 * @description Has the responsibility of generating a single mutated grid.
 * Unlike the GridGenerator, that we only need one instance of, multiple instances
 * of the mutator can exist, since we might want to stop the generation of a
 * mutated grid midway.
 *
 * You might say that this class is like a real-life factory that creates a single item.
 * At any time you can ask the factory to throw away the item that's being produced,
 * and then possibly ask to generate a new one instead.
 */
export class GridMutator extends AbstractGridGenerator {

    protected constructor() {
        super();
    }

    public async mutateGrid(existingWords: Word[]): Promise<Grid> {
        return null;
    }

}
