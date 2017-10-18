import { getCallers } from './utils';

export enum Level {
    ALL,
    DEBUG,
    INFO,
    IMPORTANT,
    WARN,
    ERROR,
    NONE
}

// declare const process: { env: any };
declare var global: any;
eval.call(null, 'var global = global || this || window;');

const SYSTEM_LEVEL = 'process' in global ?
    typeof global['process'].env['LOG_LEVEL'] === 'string' && global['process'].env['LOG_LEVEL'].toUpperCase() in Level ?
        Level[global['process'].env['LOG_LEVEL'].toUpperCase()] : Level.IMPORTANT
    : Level.ALL;

export class Logger {
    public static readonly SYSTEM_LEVEL = SYSTEM_LEVEL;
    public static readonly DISPLAY_TIME = true;
    private static readonly DEFAULT_NAMESPACE = 'Global';
    private static readonly INSTANCES: Map<string, Logger> = new Map();

    public static getLogger(namespace?: string): Logger {
        if (!namespace) {
            namespace = Logger.DEFAULT_NAMESPACE;
        }
        if (!Logger.INSTANCES.has(namespace)) {
            Logger.INSTANCES.set(namespace, new Logger(namespace));
        }
        return Logger.INSTANCES.get(namespace);
    }

    private constructor(private readonly namespace: string) { }

    private print(printType: 'log' | 'error', priorityPrefix: string | null, message?: any, ...optionalParams: any[]) {
        let prefix = `[${this.namespace}]`;

        if (Logger.DISPLAY_TIME) {
            const NOW = new Date();
            prefix = `[${NOW.toLocaleTimeString()}] ${prefix}`;
        }

        if (priorityPrefix) {
            prefix = `${prefix} [${priorityPrefix}]`;
        }

        if (typeof message === 'string') {
            message = `${prefix} ${message}`;
        } else {
            optionalParams = [message, ...optionalParams];
            message = prefix;
        }

        console[printType].apply(console, [message, ...optionalParams]);
    }

    private printLog(priorityPrefix: string | null, message?: any, ...optionalParams: any[]): void {
        this.print('log', priorityPrefix, message, ...optionalParams);
    }

    private printError(priorityPrefix: string | null, message?: any, ...optionalParams: any[]): void {
        this.print('error', priorityPrefix, message, ...optionalParams);
    }

    public info(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.INFO) {
            this.printLog('INFO', message, ...optionalParams);
        }
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.DEBUG) {
            this.printLog(`DEBUG] [${getCallers()[1]}`, message, ...optionalParams);
        }
    }

    public log(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.INFO) {
            this.printLog(null, message, ...optionalParams);
        }
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.WARN) {
            this.printError(`WARN] [${getCallers()[1]}`, message, ...optionalParams);
        }
    }

    public error(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.ERROR) {
            this.printError(`ERROR] [${getCallers()[1]}`, message, ...optionalParams);
        }
    }
}

export namespace Logger {
    enum Level {
        ALL,
        DEBUG,
        INFO,
        IMPORTANT,
        WARN,
        ERROR,
        NONE
    }
}

Logger.getLogger().log('Current platform: %s', 'process' in global ? global['process'].platform : 'browser');
