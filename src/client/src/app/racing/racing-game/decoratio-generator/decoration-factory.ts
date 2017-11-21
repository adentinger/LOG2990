import { Tree } from '../models/decoration/tree';
import { Bush } from '../models/decoration/bush';
import { Building } from '../models/decoration/building';
import { Decoration } from '../models/decoration/decoration';

export class DecorationFactory {

    constructor() {
    }

    public getClassInstance(className: string): Decoration {
        switch (className) {
            case 'TREE':  return new Tree();
            case 'BUSH': return new Bush();
            case 'BUILDING': return new Building();
        }
    }
}
