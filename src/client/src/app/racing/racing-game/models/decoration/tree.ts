import * as THREE from 'three';

import { Decoration } from './decoration';
import { Loader } from '../loader';

export class Tree extends Decoration {

    private static readonly BASE_PATH = 'assets/racing/decoration/oak_tree/';

    private static readonly PART_NAMES: string[] = [
        'oak_green1_leaves', 'oak_green2_leaves', 'oak_trunk'
    ];

    private static readonly LOADER = new Loader();

    public static readonly TREE_PARTS = Tree.LOADER.loadAll(Tree.BASE_PATH, Tree.PART_NAMES);

    constructor() {
        super();
        this.addTreeParts();
    }

    private addTreeParts(): void {
        Tree.TREE_PARTS.then(parts => {
            const clonedParts = parts.map(part => {
                return part.clone();
            });
            clonedParts.forEach(part => part.material = (part.material as THREE.Material).clone());
            this.add(... clonedParts);
        });
    }

}

