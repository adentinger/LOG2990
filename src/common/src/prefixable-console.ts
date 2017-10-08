export declare interface PrefixableConsole extends Console {
    pushPrefix: (prefix: string) => void;
    popPrefix: () => string;
}
exports.console = global.console as PrefixableConsole;
export declare var console: PrefixableConsole;

const LOG_PREFIXES: string[] = [];

const CONSOLE_PROTOTYPE = console.constructor.prototype as PrefixableConsole;
CONSOLE_PROTOTYPE.pushPrefix = LOG_PREFIXES.push.bind(LOG_PREFIXES);
CONSOLE_PROTOTYPE.popPrefix = LOG_PREFIXES.pop.bind(LOG_PREFIXES);


type Logger = (message?: any, ...optionalParams: any[]) => void;
const LOGGER_TO_BIND = function (this: Console, originalFunction: Logger, message?: any, ...optionalParams: any[]): void {
    const ARGV: any[] = Array.from(LOG_PREFIXES);
    if (message) {
        ARGV.push(message);
    }
    ARGV.push.apply(ARGV, optionalParams);

    originalFunction.apply(console, ARGV);
};
global.console.warn = LOGGER_TO_BIND.bind(global.console, global.console.warn, '[WARNING]');
global.console.log = LOGGER_TO_BIND.bind(global.console, global.console.log);


// Decorator Factory
export function PrefixLogWith(prefix: string): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        const ORIGINAL_FUNCTION = descriptor.value;
        descriptor.value = function (...argv: any[]): any {
            let returnedValue: any;
            console.pushPrefix(prefix);
            try {
                returnedValue = ORIGINAL_FUNCTION.apply(this, argv);
            } catch (e) {
                console.popPrefix();
                throw e;
            }
            console.popPrefix();
            return returnedValue;
        };
    };
};
