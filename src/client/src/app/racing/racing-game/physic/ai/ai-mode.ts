import { Meters } from '../../../../types';

export interface AiWeights {
    track: number;
    obstacles: number;
    opponents: number;
}

export class AiMode {
    public static readonly AMATEUR = new AiMode(
        { track: 0.3, obstacles: 0.3, opponents: 0.3 },
        3.5,
        0.5,
        1,
        20,
        5,
        5,
        2
    );
    public static readonly PROFESSIONAL = new AiMode(
        { track: 0.5, obstacles: 0.2, opponents: 0.3 },
        10,
        1,
        4,
        30,
        10,
        10,
        5
    );

    private constructor(
        public readonly angularWeights: AiWeights,
        public readonly angularSpeedForTrackFactor: number,
        public readonly angularSpeedForObstaclesFactor: number,
        public readonly angularSpeedForOpponentsFactor: number,
        public readonly distanceOfTargetFromCar: Meters,
        public readonly distanceToSlow: Meters,
        public readonly distanceToStartAvoidingObstacles: Meters,
        public readonly distanceToStartAvoidingOpponents: Meters) { }
}
