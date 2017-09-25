import { Injectable } from '@angular/core';

import { Meters } from '../../racing/types';

@Injectable()
export abstract class AbstractRacingUnitConversionService {

    constructor() { }

    public abstract lengthFromGameUnits(length: Meters): number;

    public abstract lengthToGameUnits(length: number): Meters;

}
