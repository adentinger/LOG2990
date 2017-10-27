import { Drawable } from './drawable';
import { Point } from '../../../../../../common/src/math/point';
import { Pothole } from '../pothole';
import { NormalPothole } from './normal-pothole';
import { ItemGenerator } from '../item-generator';
import { MapEditorService } from '../map-editor.service';

export class MapItems implements Drawable {

    private context: CanvasRenderingContext2D;
    private itemGenerator = new ItemGenerator();
    private drawablePotholes: NormalPothole[] = [];

    constructor(context: CanvasRenderingContext2D, private mapEditor: MapEditorService) {
        this.context = context;
    }

    public convertPotholes(potholes: Pothole[]): void {
        this.drawablePotholes = [];
        for (let i = 0; i < potholes.length; i++) {
            const point = this.itemGenerator.itemCoordinates(this.mapEditor.currentMap, potholes[i]);
            this.drawablePotholes.push(new NormalPothole(this.context, point.x, point.y));
            console.log(point);
        }
    }

    public draw(): void {
        this.convertPotholes(this.mapEditor.currentMap.potholes);

        if (this.mapEditor.currentMap.potholes.length === 0) {
            this.deletePotholes();
        }
        else {
            for (let i = 0; i < this.drawablePotholes.length; i++) {
                this.drawablePotholes[i].draw();
            }
        }

    }

    private deletePotholes(): void {
        const AMOUNT_OF_ITEMS = this.drawablePotholes.length;

        for (let i = 0; i < AMOUNT_OF_ITEMS; i++) {
            this.drawablePotholes.pop();
        }
    }

}
