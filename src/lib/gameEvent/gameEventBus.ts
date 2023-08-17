import {GameEvent} from "./gameEvent";
import {logger, LogType} from "../utils/loggerUtils";

export class GameEventBus {

    private static _channels: Map<string, Array<Function>> = new Map<string, Array<Function>>();

    public static register(channel: string, eventHandler: Function): void {
        if (!this._channels.has(channel)) {
            logger(LogType.INFO, `Creating new channel -> ${channel}`);
            this._channels.set(channel, []);
        } else {
            logger(LogType.INFO, `Registering new listener to existing channel -> ${channel}`)
        }

        this._channels.get(channel).push(eventHandler);
    }

    public static publish(gameEvent: GameEvent) {

        if (this._channels.has(gameEvent.channel)) {
            let listeners = this._channels.get(gameEvent.channel);

            for (let listener of listeners) {
                try {
                    listener(gameEvent);
                } catch (e) {
                    logger(LogType.ERROR, `Incorrectly defined handler-> ${JSON.stringify(gameEvent)}`);
                    console.log(e);
                }
            }
        } else {
            logger(LogType.ERROR, "No listeners registered for channel -> " + gameEvent.channel);
        }
    }
}
