import {logger, LogType} from "../utils/loggerUtils";


export class LocalStorage {

    public static init() {

        if (!window.localStorage) {
            logger(LogType.ERROR, "You need a browser that supports LocalStorage");
            Error("You need a browser that supports LocalStorage");
        }
    }

    public static saveObject(key: string, object: Object) {
        try {
            localStorage.setItem(key, JSON.stringify(object));
        } catch (e) {
            if (e === "QUOTA_EXCEEDED_ERR") {
                logger(LogType.ERROR, "Storage limit exceeded");
                Error("Storage Limit exceeded");
            }
        }
    }

    public static deleteObject(key: string) {
        localStorage.removeItem(key);
    }

    public static getObject(key: string): Object {
        return JSON.parse(localStorage.getItem(key));
    }

    static doesKeyExist(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}
