import {GameComponent} from "@lib/ecs/gameComponent";


export class TransparentComponent implements GameComponent {

    getName(): string {
        return "transparent";
    }

}
