import {GameComponent} from "@lib/ecs/gameComponent";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";

export class SearchingComponent implements GameComponent {

    private _searching: InventoryComponent;

    constructor(searching: InventoryComponent) {
        this._searching = searching;

    }


    get searching(): InventoryComponent {
        return this._searching;
    }

    set searching(value: InventoryComponent) {
        this._searching = value;
    }

    getName(): string {
        return "searching";
    }


}
