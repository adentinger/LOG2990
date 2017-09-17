export abstract class MapColors {

    public getColorOf(token: string): string {
        const COLOR = this[token];
        if (COLOR !== null) {
            return COLOR;
        }
        else {
            throw new Error(`Invalid token: ${token}`);
        }
    }

}
