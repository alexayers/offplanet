import {GameComponent} from "@lib/ecs/gameComponent";

export class CanHaveMessage implements GameComponent {


    private _callBack: Function

    constructor(callback: Function) {
        this._callBack = callback;
    }


    get callBack(): Function {
        return this._callBack;
    }

    set callBack(value: Function) {
        this._callBack = value;
    }

    getName(): string {
        return "canHaveMessage";
    }

}
