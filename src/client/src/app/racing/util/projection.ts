import { Line } from '../../../../../common/src/math/line';

export class Projection {
    constructor(public readonly interpolation: number,
        public readonly segment: Line,
        public readonly distanceToSegment: number) { }
}
