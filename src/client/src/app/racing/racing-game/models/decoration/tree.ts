import * as THREE from 'three';

import { Decoration } from './decoration';
import { Loader } from '../loader';

export class Tree extends Decoration {

    private static readonly BASE_PATH = 'assets/racing/decoration/oak_tree/';

    private static readonly PART_NAMES: string[] = [
        'oak_green1_leaves', 'oak_green2_leaves', 'oak_trunk'
    ];

    private static readonly PARTS = Decoration.loader.loadAll(Tree.BASE_PATH, Tree.PART_NAMES);

    constructor() {
        super();
        Tree.PARTS.then(parts => this.addParts(parts));
    }

}

