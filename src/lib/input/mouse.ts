export enum MouseButton {
    LEFT,
    MIDDLE,
    RIGHT
}

export class Mouse {

    private static _y: number;
    private static _x: number;
    private static _button: MouseButton;

    static set button(button: MouseButton) {
        this._button = button;
    }

    static get button(): MouseButton {
        return this._button;
    }

    static set x(x: number) {
        this._x = x;
    }

    static get x() {
        return this._x
    }

    static set y(y: number) {
        this._y = y;
    }

    static get y() {
        return this._y;
    }
}
