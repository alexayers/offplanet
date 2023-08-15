import {uuid} from "../utils/idUtilts";

export abstract class Widget {

    protected _id: string
    protected _x: number
    protected _y: number
    protected _width: number;
    protected _height: number;
    protected _isMouseOver: boolean = false;
    private _callBack: Function = null;

    constructor() {
        this._id = uuid();
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

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


    get isMouseOver(): boolean {
        return this._isMouseOver;
    }

    set isMouseOver(value: boolean) {
        this._isMouseOver = value;
    }

    get callBack(): Function {
        return this._callBack;
    }

    set callBack(value: Function) {
        this._callBack = value;
    }

    invoke(): void {
        this.callBack();
    }

    abstract render(offsetX: number, offsetY: number): void;
}
