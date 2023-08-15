import {GameComponent} from "@lib/ecs/gameComponent";


export class DrillingActionComponent implements GameComponent {

    getName(): string {
        return "drilling";
    }

}
