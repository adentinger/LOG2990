import * as THREE from 'three';
import { Decoration } from './decoration';

export class Bush extends Decoration {

    private static readonly BASE_PATH = 'assets/racing/decoration/fir_bush/';

    private static readonly PART_NAMES: string[] = [
        'fir_trunk', 'fir_leaves'
    ];

    private static readonly PARTS = Decoration.loader.loadAll(Bush.BASE_PATH, Bush.PART_NAMES);

    constructor() {
        super();
        Bush.PARTS.then(parts => this.addParts(parts));
    }
}
