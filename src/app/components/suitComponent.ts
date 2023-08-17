import {GameComponent} from "@lib/ecs/gameComponent";

export class SuitComponent implements GameComponent {

    private _max: number;
    private _current: number;


    constructor(current: number, max: number) {
        this._current = current;
        this._max = max;

    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }

    get current(): number {
        return this._current;
    }

    set current(value: number) {
        this._current = value;
    }

    getName(): string {
        return "suit";
    }

}
