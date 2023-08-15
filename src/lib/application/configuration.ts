import {LocalStorage} from "../localStorage/localStorage";
import {logger, LogType} from "../utils/loggerUtils";

export class ConfigurationManager {
    private static _configuration: any;

    public static init(json: any) {
        ConfigurationManager._configuration = json;
        ConfigurationManager.saveConfiguration();

        logger(LogType.INFO, `Configuration: ${JSON.stringify(json)}`);
        logger(LogType.INFO, "Configuration initialized");
    }

    private static saveConfiguration() {

        if (ConfigurationManager.doesConfigurationExist()) {
            logger(LogType.INFO, "Configuration already exists");
        }

        LocalStorage.saveObject("configuration", ConfigurationManager._configuration);
    }

    public static getValue(key: string): any {
        return ConfigurationManager._configuration[key];
    }

    private static doesConfigurationExist() {
        return LocalStorage.doesKeyExist("configuration");
    }

}
