import {GameComponent} from "@lib/ecs/gameComponent";


export class ItemComponent implements GameComponent {
    getName(): string {
        return "item";
    }

}
