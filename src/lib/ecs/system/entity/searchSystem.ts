import {GameSystem, processComponents} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {World} from "@lib/rendering/rayCaster/world";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";
import {SearchingComponent} from "@lib/ecs/components/interactions/searchingComponent";


export class SearchSystem implements GameSystem {

    private _worldMap: World = World.getInstance();

    @processComponents(["camera", "search"], ["search"])
    processEntity(gameEntity: GameEntity): void {


        let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;
        let searching: InventoryComponent = this.searchObject(camera);

        if (searching != null) {
            gameEntity.addComponent(new SearchingComponent(searching));
        }

    }

    searchObject(camera: CameraComponent): InventoryComponent {
        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._worldMap.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("inventory")) {
            let inventory: InventoryComponent = gameEntity.getComponent("inventory") as InventoryComponent;
            return inventory;
        }

        gameEntity = this._worldMap.getPosition(checkMapX2, checkMapY2);

        if (gameEntity && (gameEntity.hasComponent("inventory"))) {

            let inventory: InventoryComponent = gameEntity.getComponent("inventory") as InventoryComponent;

            return inventory;
        }


        return null;

    }


}
