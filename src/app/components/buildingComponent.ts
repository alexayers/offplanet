import {GameComponent} from "@lib/ecs/gameComponent";


export class BuildingComponent implements GameComponent {

    getName(): string {
        return "building";
    }

}
