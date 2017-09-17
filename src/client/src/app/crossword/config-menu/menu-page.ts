export interface Option {
    name: string;
    clickHandler: () => void;
}

type StringResolver = () => string;
type StringOrResolver = string | StringResolver;

export interface MenuPage {
    id: number;
    title: string;
    description?: StringOrResolver;
    options: Option[];
}
