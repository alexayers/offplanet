import {GameComponent} from "@lib/ecs/gameComponent";


export class CanInteractComponent implements GameComponent {

    private _callBack: Function;

    constructor(callBack: Function = null) {
        this._callBack = callBack;
    }


    get callBack(): Function {
        return this._callBack;
    }

    set callBack(value: Function) {
        this._callBack = value;
    }

    getName(): string {
        return "canInteract";
    }

}
