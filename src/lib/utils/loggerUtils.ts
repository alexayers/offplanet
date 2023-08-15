export enum LogType {
    INFO,
    DEBUG,
    ERROR
}

export function logger(logType: LogType, msg: string) {

    let date = new Date();

    switch (logType) {
        case LogType.INFO:
            console.info(date.toISOString() + " - " + msg);
            break;
        case LogType.ERROR:
            console.error(date.toISOString() + " - " + msg);
            break;
        case LogType.DEBUG:
            console.debug(date.toISOString() + " - " + msg);
            break;
    }

}
