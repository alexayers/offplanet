import {GameComponent} from "@lib/ecs/gameComponent";
import {Sprite} from "@lib/rendering/sprite";


export class DamagedComponent implements GameComponent {

    private _damage: number;
    private _damageSprite: Sprite;

    constructor(damage: number, damagedSprite: Sprite) {
        this._damage = damage;
        this._damageSprite = damagedSprite;
    }


    get damageSprite(): Sprite {
        return this._damageSprite;
    }

    set damageSprite(value: Sprite) {
        this._damageSprite = value;
    }

    get damage(): number {
        return this._damage;
    }

    set damage(value: number) {
        this._damage = value;
    }

    getName(): string {
        return "damaged";
    }

}
