import {GameSystem} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {CanInteractComponent} from "@lib/ecs/components/canInteractComponent";
import {World} from "@lib/rendering/rayCaster/world";
import {DamagedComponent} from "@lib/ecs/components/damagedComponent";


export class RepairSystem implements GameSystem {

    private _world: World = World.getInstance();
    processEntity(gameEntity: GameEntity): void {

        if (gameEntity.hasComponent("camera") && gameEntity.hasComponent("interacting")) {

            let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;

            if (this.isDamaged(camera)) {
                gameEntity.removeComponent("interacting");

                this.repairObject(camera);

            } else {
            }

        }

    }

    isDamaged(camera: CameraComponent) : boolean {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("damaged")) {
            return true;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("damaged")) {
            return true;
        }

        return false;
    }

    repairObject(camera: CameraComponent) : void {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("damaged")) {

            let damage : DamagedComponent = gameEntity.getComponent("damaged") as DamagedComponent;
            damage.damage = damage.damage - 10;

            if (damage.damage <= 0) {
                gameEntity.removeComponent("damaged");
                console.log(`Repaired ${gameEntity.name}`)
            }

            return;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("damaged")) {
            let damage : DamagedComponent = gameEntity.getComponent("damaged") as DamagedComponent;
            damage.damage = damage.damage - 10;

            if (damage.damage <= 0) {
                gameEntity.removeComponent("damaged");
                console.log(`Repaired ${gameEntity.name}`)
            }
            return;
        }


    }

}
