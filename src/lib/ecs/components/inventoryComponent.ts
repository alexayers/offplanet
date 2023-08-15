import {GameComponent} from "@lib/ecs/gameComponent";
import {GameEntity} from "@lib/ecs/gameEntity";


export class InventoryComponent implements GameComponent {

    private _inventory: Array<GameEntity> = [];
    private _maxItems: number = 6;
    private _currentItemIdx: number = -1;

    constructor(maxItems: number) {
        this._maxItems = maxItems;

    }


    getCurrentItem(): GameEntity {
        return this._inventory[this._currentItemIdx];
    }

    dropItem(): void {
        if (this._currentItemIdx != -1) {
            this._inventory[this._currentItemIdx] = null;
        }
    }

    addItem(item: GameEntity): boolean {

        for (let i: number = 0; i < this._maxItems; i++) {
            if (this._inventory[i] == null) {
                this._inventory[i] = item;
                this._currentItemIdx = i;
                return true;
            }
        }

        return false;
    }


    get inventory(): Array<GameEntity> {
        return this._inventory;
    }

    set inventory(value: Array<GameEntity>) {
        this._inventory = value;
    }

    get maxItems(): number {
        return this._maxItems;
    }

    set maxItems(value: number) {
        this._maxItems = value;
    }

    get currentItemIdx(): number {
        return this._currentItemIdx;
    }

    set currentItemIdx(value: number) {
        this._currentItemIdx = value;
    }

    getName(): string {
        return "inventory";
    }


}
