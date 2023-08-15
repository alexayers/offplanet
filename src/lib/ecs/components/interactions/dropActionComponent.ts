import {GameComponent} from "@lib/ecs/gameComponent";

export class DropActionComponent implements GameComponent {

    getName(): string {
        return "drop";
    }

}
