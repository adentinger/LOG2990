import { AbstractGridGenerator } from './abstract-grid-generator';
import { Grid } from './grid';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { Logger } from '../../../../../common/src/index';

/**
 * @class GridGenerator
 * @description Manages the creation of Grids from scratch.
 */
export class GridGenerator extends AbstractGridGenerator {

    private static readonly INSTANCE = new GridGenerator();
    private static count = 0;

    private logger = Logger.getLogger('GridGenerator');

    public static getInstance(): GridGenerator {
        return GridGenerator.INSTANCE;
    }

    protected constructor() {
        super();
    }

    public async gridGeneration(difficulty: Difficulty): Promise<Grid> {
        const grid = await super.gridGenerationBase([], new AbstractWordSuggestionsGetter(difficulty));
        this.logger.log('count: %d', ++GridGenerator.count);
        this.logger.log(grid.toString());
        return grid;
    }

}
