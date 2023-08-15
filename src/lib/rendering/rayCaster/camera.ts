import {rotateVector} from "@lib/utils/mathUtils";
import {Point} from "@lib/primatives/point";
import {World} from "@lib/rendering/rayCaster/world";
import {GameEntity} from "@lib/ecs/gameEntity";
import {DoorComponent} from "@lib/ecs/components/doorComponent";


export class Camera {

    private _xPos: number;
    private _yPos: number;
    private _xDir: number;
    private _yDir: number;
    private _fov: number;
    private _xPlane: number;
    private _yPlane: number;

    constructor(xPos: number, yPos: number, xDir: number, yDir: number, fov: number) {

        this._xPos = xPos;
        this._yPos = yPos;
        this._xDir = xDir;
        this._yDir = yDir;
        this._fov = fov;
        this._xPlane = rotateVector(this._xDir, this._yDir, -Math.PI / 2).x * fov;
        this._yPlane = rotateVector(this._xDir, this._yDir, -Math.PI / 2).y * fov;
    }

    move(moveX: number, moveY: number): void {

        let worldMap: World = World.getInstance();
        let gameEntity: GameEntity = worldMap.getPosition(Math.floor(this._xPos + moveX), Math.floor(this._yPos));

        if (gameEntity.hasComponent("floor")) {
            this._xPos += moveX;
        }

        if (gameEntity.hasComponent("door")) {
            let door: DoorComponent = gameEntity.getComponent("door") as DoorComponent;

            if (door.isOpen()) {
                this._xPos += moveX;
            }
        }

        gameEntity = worldMap.getPosition(Math.floor(this._xPos), Math.floor(this._yPos + moveY))

        if (gameEntity.hasComponent("floor")) {
            this._yPos += moveY;
        }

        if (gameEntity.hasComponent("door")) {
            let door: DoorComponent = gameEntity.getComponent("door") as DoorComponent;

            if (door.isOpen()) {
                this._yPos += moveY;
            }
        }

    }

    rotate(angle: number): void {
        let rDir: Point = rotateVector(this._xDir, this._yDir, angle);
        this._xDir = rDir.x;
        this._yDir = rDir.y;

        let rPlane: Point = rotateVector(this._xPlane, this._yPlane, angle);
        this._xPlane = rPlane.x;
        this._yPlane = rPlane.y;
    }


    get xPos(): number {
        return this._xPos;
    }

    set xPos(value: number) {
        this._xPos = value;
    }

    get yPos(): number {
        return this._yPos;
    }

    set yPos(value: number) {
        this._yPos = value;
    }

    get xDir(): number {
        return this._xDir;
    }

    set xDir(value: number) {
        this._xDir = value;
    }

    get yDir(): number {
        return this._yDir;
    }

    set yDir(value: number) {
        this._yDir = value;
    }

    get fov(): number {
        return this._fov;
    }

    set fov(value: number) {
        this._fov = value;
    }

    get xPlane(): number {
        return this._xPlane;
    }

    set xPlane(value: number) {
        this._xPlane = value;
    }

    get yPlane(): number {
        return this._yPlane;
    }

    set yPlane(value: number) {
        this._yPlane = value;
    }
}
