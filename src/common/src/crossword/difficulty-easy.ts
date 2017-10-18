import { Difficulty } from './difficulty';

export class DifficultyEasy extends Difficulty {

    constructor() {
        super();
    }

    public isWordCommon(): boolean {
        return true;
    }

}
