export enum DayMode {
    DAY = 0,
    NIGHT
}

export class DayModeManager {

    public mode: DayMode = DayMode.DAY;

    public updateScene(scene: THREE.Scene): void {

    }

}
