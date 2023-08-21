import {Camera} from "@lib/rendering/rayCaster/camera";
import {Renderer} from "@lib/rendering/renderer";
import {Sprite} from "@lib/rendering/sprite";


export class TransparentWall {

    private _xMap: number;
    private _yMap: number;
    private _side: number;
    private _sprite: Sprite;
    private _xScreen: Array<number> = [];
    private _camera: Camera
    private _cameraXCoords;

    constructor(sprite: Sprite, camera: Camera, xMap: number, yMap: number, side: number, xScreen: Array<number>, cameraXCoords) {

        this._sprite = sprite;
        this._camera = camera;
        this._xMap = xMap;
        this._yMap = yMap;
        this._side = side;
        this._xScreen = xScreen;
        this._cameraXCoords = cameraXCoords;
    }


    get xMap(): number {
        return this._xMap;
    }

    set xMap(value: number) {
        this._xMap = value;
    }

    get yMap(): number {
        return this._yMap;
    }

    set yMap(value: number) {
        this._yMap = value;
    }

    get side(): number {
        return this._side;
    }

    set side(value: number) {
        this._side = value;
    }

    get xScreen() {
        return this._xScreen;
    }

    set xScreen(value) {
        this._xScreen = value;
    }

    get camera(): Camera {
        return this._camera;
    }

    set camera(value: Camera) {
        this._camera = value;
    }

    get cameraXCoords() {
        return this._cameraXCoords;
    }

    set cameraXCoords(value) {
        this._cameraXCoords = value;
    }

    getRayDir(x: number, side: number): number {
        if (side == 1) {
            return this._camera.yDir + this._camera.yPlane * this._cameraXCoords[x];
        } else {
            return this._camera.xDir + this._camera.xPlane * this._cameraXCoords[x];
        }
    }

    getPerpDist(x: number): number {
        let step: number = 1;
        let rayDir: number = this.getRayDir(x, this._side);

        if (rayDir < 0) {
            step = -1;
        }

        if (this._side == 1) {
            return (this._yMap - this._camera.yPos + (0.5 * step) + (1 - step) / 2) / rayDir;
        } else {
            return (this._xMap - this._camera.xPos + (0.5 * step) + (1 - step) / 2) / rayDir;
        }
    }

    draw(): void {

        Renderer.saveContext();

        Renderer.setAlpha(0.25);


        for (let x: number = this._xScreen[0]; x < this._xScreen[0] + this._xScreen.length; x++) {
            let perpDist: number = this.getPerpDist(x);
            let lineHeight: number = Math.round(Renderer.getCanvasHeight() / perpDist);
            let drawStart: number = -lineHeight / 2 + Renderer.getCanvasHeight() / 2;

            let wallX: number;
            if (this._side == 0) {
                wallX = this._camera.yPos + perpDist * this.getRayDir(x, 1);
            } else if (this._side == 1) {
                wallX = this._camera.xPos + perpDist * this.getRayDir(x, 0);
            }

            wallX -= Math.floor(wallX);


            let texX: number = Math.floor(wallX * this._sprite.image.width);
            Renderer.renderClippedImage(this._sprite.image, texX, 0, 1, this._sprite.image.height, x, drawStart, 1, lineHeight);

        }

        Renderer.restoreContext()


    }

}
