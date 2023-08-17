import {GameEventBus} from "../gameEvent/gameEventBus";
import {GameEvent} from "../gameEvent/gameEvent";
import {AudioFile} from "./audioFile";
import {ConfigurationManager} from "../application/configuration";
import {logger, LogType} from "../utils/loggerUtils";


export class AudioManager {
    private static _soundMap: Map<string, AudioFile> = new Map<string, AudioFile>();
    private static _audioEnabled: boolean;

    static init(): void {
        let soundCheck = new Audio();

        this._audioEnabled = ConfigurationManager.getValue("audioEnabled") as boolean;

        logger(LogType.INFO, "Is audio enabled? " + this._audioEnabled);

        if (!soundCheck.canPlayType('audio/ogg')) {
            logger(LogType.ERROR, "Your browser doesn't support audio/ogg");
            Error("Your browser doesn't support audio/ogg");
        }

        GameEventBus.register("audio", AudioManager.handleEvent);
    }

    static register(name: string, audioFile: string, loop: boolean = false): void {
        AudioManager._soundMap.set(name, new AudioFile(audioFile, loop));
    }

    static play(name: string): void {
        if (this._audioEnabled) {

            if (AudioManager._soundMap.has(name)) {
                AudioManager._soundMap.get(name).play();
            } else {
                logger(LogType.ERROR, `Requesting to play sound that hasn't been registered -> ${name}`);
            }

        }
    }


    static stop(name: string): void {
        if (this._audioEnabled) {
            if (AudioManager._soundMap.has(name)) {
                AudioManager._soundMap.get(name).stop();
            } else {
                logger(LogType.ERROR, `Requesting to stop sound that hasn't been registered -> ${name}`);
            }
        }
    }

    static handleEvent(gameEvent: GameEvent): void {
        AudioManager.play(gameEvent.payload);
    }


}
