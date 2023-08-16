import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {GameEntity} from "@lib/ecs/gameEntity";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {World} from "@lib/rendering/rayCaster/world";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";



export class BuildingRenderSystem implements GameRenderSystem {

    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();
    private _world: World = World.getInstance();
    process(): void {

        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");
        let inventory : InventoryComponent = player.getComponent("inventory") as InventoryComponent;

        if (inventory.getCurrentItem().name != "building") {
            return;
        }

        let camera: CameraComponent = player.getComponent("camera") as CameraComponent;

        if (this.isEmpty(camera)) {
            this.showObject(camera);
        }

    }

    showObject(camera: CameraComponent): void {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity && gameEntity.hasComponent("floor")) {
            return;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("floor")) {
            return;
        }

    }

    isEmpty(camera: CameraComponent): boolean {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity &&  gameEntity.hasComponent("floor")) {
            return true;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity &&  gameEntity.hasComponent("floor")) {
            return true;
        }

        return false;
    }

}
