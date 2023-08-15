import {GameComponent} from "@lib/ecs/gameComponent";


export class DrillComponent implements GameComponent {

    private _speed: number;

    constructor(speed: number) {
        this._speed = speed;
    }


    get speed(): number {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }

    getName(): string {
        return "drill";
    }

}
