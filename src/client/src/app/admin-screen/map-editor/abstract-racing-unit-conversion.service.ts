import { Injectable } from '@angular/core';

@Injectable()
export abstract class AbstractRacingUnitConversionService {

    constructor() { }

    public abstract lengthFromGameUnits(length: number): number;

    public abstract lengthToGameUnits(length: number): number;

}
