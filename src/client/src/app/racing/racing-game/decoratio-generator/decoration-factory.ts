import { Tree } from '../models/decoration/tree';
import { Bush } from '../models/decoration/bush';
import { Building } from '../models/decoration/building';
import { CollidableMesh } from '../physic/collidable';

export class DecorationFactory {

    constructor() {
    }

    public getClassInstance(className: string): CollidableMesh {
        switch (className) {
            case 'Tree':  return new Tree();
            case 'Bush': return new Bush();
            case 'Building': return new Building();
        }
    }
}
