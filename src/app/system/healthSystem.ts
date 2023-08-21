import {GameSystem, processComponents} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {HealthComponent} from "../components/healthComponent";
import {DamageComponent} from "@lib/ecs/components/damageComponent";
import {DeadComponent} from "@lib/ecs/components/deadComponent";


export class HealthSystem implements GameSystem {


    @processComponents(["health", "damage"], ["damage"])
    processEntity(gameEntity: GameEntity): void {

        let health: HealthComponent = gameEntity.getComponent("health") as HealthComponent;
        let damage: DamageComponent = gameEntity.getComponent("damage") as DamageComponent;

        health.current -= damage.amount;

        if (health.current <= 0) {

            health.current = 0;
            gameEntity.addComponent(new DeadComponent());
        }

    }


}
