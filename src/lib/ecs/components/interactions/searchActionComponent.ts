import {GameComponent} from "@lib/ecs/gameComponent";

export class SearchActionComponent implements GameComponent {


    getName(): string {
        return "search";
    }

}
