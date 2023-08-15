import {GameComponent} from "@lib/ecs/gameComponent";


export class VelocityComponent implements GameComponent {

    private _velX: number;
    private _velY: number

    private _rotateLeft: boolean;
    private _rotateRight: boolean;

    constructor(velX: number, velY: number) {
        this._velX = velX;
        this._velY = velY;

        this._rotateLeft = false;
        this._rotateRight = false;
    }


    get rotateLeft(): boolean {
        return this._rotateLeft;
    }

    set rotateLeft(value: boolean) {
        this._rotateLeft = value;
    }

    get rotateRight(): boolean {
        return this._rotateRight;
    }

    set rotateRight(value: boolean) {
        this._rotateRight = value;
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

    getName(): string {
        return "velocity";
    }

}
