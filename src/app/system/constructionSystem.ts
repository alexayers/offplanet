import {GameSystem, processComponents} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {World} from "@lib/rendering/rayCaster/world";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";


export class ConstructionSystem implements GameSystem {

    private _world: World = World.getInstance();
    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();

    @processComponents(["camera", "buildAction"], ["buildAction"])
    processEntity(gameEntity: GameEntity): void {

        let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;

        if (this.isEmpty(camera)) {
            this.placeWall(camera);
        }


    }

    placeWall(camera: CameraComponent): void {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("floor")) {

            this._world.placeTile(checkMapX, checkMapY, this._gameEntityRegistry.getEntity("stationWall"));

            return;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("floor")) {
            this._world.placeTile(checkMapX2, checkMapY2, this._gameEntityRegistry.getEntity("stationWall"));
            return;
        }

        return;
    }

    isEmpty(camera: CameraComponent): boolean {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("floor")) {
            return true;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("floor")) {
            return true;
        }

        return false;
    }

}
