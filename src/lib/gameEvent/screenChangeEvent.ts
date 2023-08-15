import {GameEvent} from "./gameEvent";


export class ScreenChangeEvent extends GameEvent {

    constructor(destinationScreen: string) {
        super("__CHANGE_SCREEN__", destinationScreen);
    }

}
