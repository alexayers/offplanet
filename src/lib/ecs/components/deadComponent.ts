import {GameComponent} from "@lib/ecs/gameComponent";


export class DeadComponent implements GameComponent {
    getName(): string {
        return "dead";
    }


}
