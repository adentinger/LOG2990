import { Path } from './path';
import { Item } from './item';

export class Map {
    public path: Path;
    public name: string;
    public description: string;
    public type: string;
    public items: Item[];
    public rating: number;
    public plays: number;
    public height: number;
    public width: number;
}
