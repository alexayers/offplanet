import {GameComponent} from "@lib/ecs/gameComponent";


export class WallComponent implements GameComponent {

    getName(): string {
        return "wall";
    }

}
