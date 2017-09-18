export interface Word {
    value: string;
    position: number;
}

export enum Difficulty {
    EASY,
    MEDIUM,
    HARD
}

export class Grid {
    public difficulty: Difficulty;
    public verticalWords: Word[] = [];
    public horizontalWords: Word[] = [];

    constructor(public size: number) {}
}
