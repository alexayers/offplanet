import {GameSystem} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {DistanceComponent} from "@lib/ecs/components/distanceComponent";
import {World} from "@lib/rendering/rayCaster/world";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";


export class PickUpDropSystem implements GameSystem {

    processEntity(gameEntity: GameEntity): void {

        if (gameEntity.hasComponent("pickUp")) {
            gameEntity.removeComponent("pickUp");
            let inventory: InventoryComponent = gameEntity.getComponent("inventory") as InventoryComponent;

            let gameEntities: Array<GameEntity> = World.getInstance().getWorldItems();

            for (let i: number = 0; i < gameEntities.length; i++) {

                let gameEntity: GameEntity = gameEntities[i];
                let distance: DistanceComponent = gameEntity.getComponent("distance") as DistanceComponent;

                if (distance.distance < 1) {
                    console.log(`pick up ${gameEntity.name}`)
                    World.getInstance().removeWorldItem(gameEntity);
                }

            }
        } else if (gameEntity.hasComponent("drop")) {
            let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;
            let inventory: InventoryComponent = gameEntity.getComponent("inventory") as InventoryComponent;


        }


    }

}
