import {Renderer} from "./renderer";
import {Sprite} from "./sprite";
import {GameComponent} from "@lib/ecs/gameComponent";


export class AnimatedSprite implements GameComponent {

    private _tick: number;
    private readonly _maxTicks: number;
    private _currentFrame: number;
    private _frames: Array<Sprite>;
    private _x: number;
    private _y: number;

    constructor(x: number, y: number, imageFiles: Array<any>, maxTicks: number = 16) {

        this._x = x;
        this._y = y;
        this._maxTicks = maxTicks;
        this._frames = [];

        for (const imageFile of imageFiles) {
            this._frames.push(new Sprite(x, y, imageFile));
        }

        this._currentFrame = 0;
        this._tick = 0;
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

    addSprite(sprite: Sprite) {
        this._frames.push(sprite);
    }

    currentSprite(): Sprite {
        return this._frames[this._currentFrame];
    }

    nextFrame(): void {
        this._tick++;

        if (this._tick == this._maxTicks) {
            this._tick = 0;
            this._currentFrame++;

            if (this._currentFrame == this._frames.length) {
                this._currentFrame = 0;
            }
        }
    }

    render(): void {
        let sprite: Sprite = this._frames[this._currentFrame];
        Renderer.renderImage(sprite.image, this._x, this._y, sprite.width, sprite.height);

        this._tick++;

        if (this._tick == this._maxTicks) {
            this._tick = 0;
            this._currentFrame++;

            if (this._currentFrame == this._frames.length) {
                this._currentFrame = 0;
            }
        }
    }

    getName(): string {
        return "animatedSprite";
    }
}
