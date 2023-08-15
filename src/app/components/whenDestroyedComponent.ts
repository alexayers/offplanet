import {GameComponent} from "@lib/ecs/gameComponent";

export class WhenDestroyedComponent implements GameComponent {

    private _callBack: Function

    constructor(callBack: Function) {
        this._callBack = callBack;
    }


    get callBack(): Function {
        return this._callBack;
    }

    set callBack(value: Function) {
        this._callBack = value;
    }

    getName(): string {
        return "whenDestroyed";
    }

}
