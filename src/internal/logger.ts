export interface Logger {
    info(message: string, obj: object): void;
    error(message: string, obj: object): void;
    warn(message: string, obj: object): void;
    debug(message: string, obj: object): void;
}
