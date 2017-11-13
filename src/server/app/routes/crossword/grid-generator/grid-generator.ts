import { AbstractGridGenerator } from './abstract-grid-generator';
import { Grid } from './grid';
import { NormalWordSuggestionsGetter } from './normal-word-suggestions-getter';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { Logger } from '../../../../../common/src/index';

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
        const grid = await super.gridGenerationBase([], new NormalWordSuggestionsGetter(difficulty));
        this.logger.log('count: %d', ++GridGenerator.count);
        this.logger.log(grid.toString());
        return grid;
    }

}
