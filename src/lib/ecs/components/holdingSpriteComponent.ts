import {GameComponent} from "@lib/ecs/gameComponent";
import {Sprite} from "@lib/rendering/sprite";


export class HoldingSpriteComponent implements GameComponent {

    private _sprite: Sprite;

    constructor(sprite: Sprite) {
        this._sprite = sprite;
    }


    get sprite(): Sprite {
        return this._sprite;
    }

    set sprite(value: Sprite) {
        this._sprite = value;
    }

    getName(): string {
        return "holdingSprite";
    }

}
