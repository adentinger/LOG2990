import { Meters } from '../../../../types';

export interface AiWeights {
    track: number;
    obstacles: number;
    opponents: number;
}

export class AiMode {
    public static readonly AMATEUR = new AiMode(
        { track: 1, obstacles: -1, opponents: 1 },    // weights
        3,                                            // track factor
        1,                                          // obstacles factor
        1,                                            // opponents factor
        10,                                           // distance to target
        5,                                            // distance for slowing
        5,                                            // distance to avoid obstacles
        2                                             // distance to avoid opponents
    );
    public static readonly PROFESSIONAL = new AiMode(
        { track: 1, obstacles: 0.8, opponents: 1 }, // weights
        10,                                           // track factor
        1,                                            // obstacles factor
        3,                                            // opponents factor
        20,                                           // distance to target
        10,                                           // distance for slowing
        10,                                           // distance to avoid obstacles
        6                                             // distance to avoid opponents
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
