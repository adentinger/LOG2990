import { ConfigMenuState } from './enums';

interface Option {
    name: string;
    clickHandler: () => void;
}

type StringResolver = () => string;
type StringOrResolver = string | StringResolver;

export interface MenuPage {
    id: ConfigMenuState;
    title: string;
    description?: StringOrResolver;
    options: Option[];
}
