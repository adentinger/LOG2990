export interface PrefixableConsole extends Console {
    pushPrefix: (prefix: string) => void;
    popPrefix: () => string;
}
export declare var console: PrefixableConsole;
export declare function PrefixLogWith(prefix: string): MethodDecorator;
