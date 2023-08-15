import {GameComponent} from "@lib/ecs/gameComponent";


export class FloorComponent implements GameComponent {

    getName(): string {
        return "floor";
    }

}
