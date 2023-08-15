import {Color} from "../primatives/color";

export class Particle {

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _alpha: number;
    private _lifeSpan: number;
    private _decayRate: number;
    private _velX: number;
    private _velY: number;
    private _color: Color = new Color();


    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get alpha(): number {
        return this._alpha;
    }

    set alpha(value: number) {
        this._alpha = value;
    }

    get lifeSpan(): number {
        return this._lifeSpan;
    }

    set lifeSpan(value: number) {
        this._lifeSpan = value;
    }

    get velX(): number {
        return this._velX;
    }

    set velX(value: number) {
        this._velX = value;
    }

    get velY(): number {
        return this._velY;
    }

    set velY(value: number) {
        this._velY = value;
    }


    get decayRate(): number {
        return this._decayRate;
    }

    set decayRate(value: number) {
        this._decayRate = value;
    }


    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }
}
