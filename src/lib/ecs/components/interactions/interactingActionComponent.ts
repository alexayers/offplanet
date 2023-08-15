import {GameComponent} from "@lib/ecs/gameComponent";


export class InteractingActionComponent implements GameComponent {


    constructor() {

    }


    getName(): string {
        return "interacting";
    }

}
