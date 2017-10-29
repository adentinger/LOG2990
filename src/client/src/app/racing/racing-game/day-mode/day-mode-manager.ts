import { isDayModeNotifiable, DayModeNotifiable } from './day-mode-notifiable';

export enum DayMode {
    DAY = 0,
    NIGHT
}

export class DayModeManager {

    public mode: DayMode = DayMode.DAY;

    public updateScene(scene: THREE.Scene): void {

        this.updateRecursively(scene);

    }

    private updateRecursively(obj: THREE.Object3D) {

        if (isDayModeNotifiable(obj)) {
            obj.dayModeChanged(this.mode);
        }

        obj.children.forEach(this.updateRecursively, this);

    }

}
