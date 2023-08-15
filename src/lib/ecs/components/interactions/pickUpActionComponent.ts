import {GameComponent} from "@lib/ecs/gameComponent";


export class PickUpActionComponent implements GameComponent {

    getName(): string {
        return "pickUp";
    }

}
