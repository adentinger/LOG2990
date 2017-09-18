export abstract class MapColors {

    public getColorOf(token: string): string {
        const COLOR = this[token]; // That's ugly but hey! Code reuse achieved.
        if (COLOR !== null) {
            return COLOR;
        }
        else {
            throw new Error(`Invalid token: ${token}`);
        }
    }

}
