export enum Direction {
    across,
    vertical,
}

export enum Owner {
    none,
    player1,
    player2,
}

export interface GridWord {
    y: number;
    x: number;
    length: number;
    direction: Direction;
    owner: Owner;
    string: string;
}
