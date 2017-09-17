import { AbstractNormalMapPointColors } from './abstract-normal-map-point-colors';

const INNER_COLOR = '#fff';
const RIM_COLOR   = '#ccc';

export class NormalMapPointColorsActive extends AbstractNormalMapPointColors {

    constructor() {
        super(INNER_COLOR, RIM_COLOR);
    }

}
