import {GameComponent} from "@lib/ecs/gameComponent";
import {AnimatedSprite} from "@lib/rendering/animatedSprite";

export class OnPowerAnimatedSpriteComponent implements GameComponent {

    private _animatedSprite: AnimatedSprite;

    constructor(animatedSprite: AnimatedSprite) {
        this._animatedSprite = animatedSprite;
    }


    get animatedSprite(): AnimatedSprite {
        return this._animatedSprite;
    }

    set animatedSprite(value: AnimatedSprite) {
        this._animatedSprite = value;
    }

    getName(): string {
        return "onPowerAnimatedSprite";
    }


}
