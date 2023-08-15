import {GameComponent} from "@lib/ecs/gameComponent";


export class CanPickUpComponent implements GameComponent {

    getName(): string {
        return "canPickUp";
    }

}
