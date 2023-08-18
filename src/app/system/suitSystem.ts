import {GameSystem, processComponents} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {SuitComponent} from "../components/suitComponent";
import {DamageComponent} from "@lib/ecs/components/damageComponent";


export class SuitSystem implements GameSystem {



    @processComponents(["camera"])
    processEntity(gameEntity: GameEntity): void {

            let suit : SuitComponent = gameEntity.getComponent("suit") as SuitComponent;
            suit.current -= 0.01;

            if (suit.current <= 0) {
                suit.current = 0;
                gameEntity.addComponent(new DamageComponent(1));
            }

    }

}
