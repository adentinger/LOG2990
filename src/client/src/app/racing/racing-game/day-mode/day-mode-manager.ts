import { isDayModeNotifiable, DayModeNotifiable } from './day-mode-notifiable';

export enum DayMode {
    DAY = 0,
    NIGHT
}

export class DayModeManager {

    public mode: DayMode = DayMode.DAY;

    public updateScene(scene: THREE.Scene): void {

        const UPDATE_OBJECT = (obj: THREE.Object3D) => {
            obj.children.forEach((child) => {
                if (isDayModeNotifiable(child)) {
                    const DAY_MODE_NOTIFIABLE_OBJECT: DayModeNotifiable = child;
                    DAY_MODE_NOTIFIABLE_OBJECT.dayModeChanged(this.mode);
                }
                UPDATE_OBJECT(child);
            });
        };

        UPDATE_OBJECT(scene);

    }

}
