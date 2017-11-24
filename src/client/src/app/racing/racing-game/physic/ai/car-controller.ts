import { Car } from '../../models/car/car';

export abstract class CarController {
    public constructor(protected controlledCar: Car) { }
}
