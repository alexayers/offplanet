import {GameComponent} from "@lib/ecs/gameComponent";


export class DamageComponent implements GameComponent {

    private _amount: number;

    constructor(damage: number) {
        this._amount = damage;
    }


    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }

    getName(): string {
        return "damage";
    }

}
