import {GameSystem} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {DoorState, World} from "@lib/rendering/rayCaster/world";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {CanInteractComponent} from "@lib/ecs/components/canInteractComponent";


export class InteractionSystem implements GameSystem {

    private _worldMap: World = World.getInstance();

    processEntity(gameEntity: GameEntity): void {

        if (gameEntity.hasComponent("camera") && gameEntity.hasComponent("interacting")) {

            let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;
            let interaction: CanInteractComponent = gameEntity.getComponent("interacting") as CanInteractComponent;

            if (!this.isDamaged(camera)) {
                if (!this.interactDoor(camera.camera)) {
                    this.interactObject(camera);
                }

                gameEntity.removeComponent("interacting");
            } else {
                console.log("damgedd");
            }

        }

    }

    isDamaged(camera: CameraComponent): boolean {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._worldMap.getPosition(checkMapX, checkMapY);

        if (gameEntity && gameEntity.hasComponent("damaged")) {
            return true;
        }

        gameEntity = this._worldMap.getPosition(checkMapX2, checkMapY2);

        if (gameEntity && gameEntity.hasComponent("damaged")) {
            return true;
        }

        return false;
    }

    interactObject(camera: CameraComponent): void {
        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._worldMap.getPosition(checkMapX, checkMapY);

        if (gameEntity && gameEntity.hasComponent("canInteract")) {
            let canInteract: CanInteractComponent = gameEntity.getComponent("canInteract") as CanInteractComponent;

            if (canInteract.callBack) {
                canInteract.callBack();
            }


            return;
        }

        gameEntity = this._worldMap.getPosition(checkMapX2, checkMapY2);

        if (gameEntity && (gameEntity.hasComponent("canInteract"))) {

            let canInteract: CanInteractComponent = gameEntity.getComponent("canInteract") as CanInteractComponent;

            if (canInteract.callBack) {
                canInteract.callBack();
            }

            return;
        }


    }

    interactDoor(camera: Camera): boolean {
        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._worldMap.getPosition(checkMapX, checkMapY);

        if (gameEntity && gameEntity.hasComponent("door") ||
            gameEntity.hasComponent("pushWall") &&
            this._worldMap.getDoorState(checkMapX, checkMapY) == DoorState.CLOSED) { //Open door in front of camera
            this._worldMap.setDoorState(checkMapX, checkMapY, DoorState.OPENING);
            return true;
        }

        gameEntity = this._worldMap.getPosition(checkMapX2, checkMapY2);

        if (gameEntity && (gameEntity.hasComponent("door") ||
                gameEntity.hasComponent("pushWall")) &&
            this._worldMap.getDoorState(checkMapX2, checkMapY2) == DoorState.CLOSED) {
            this._worldMap.setDoorState(checkMapX2, checkMapY2, DoorState.OPENING);
            return true;
        }

        gameEntity = this._worldMap.getPosition(checkMapX, checkMapY);

        if (gameEntity && gameEntity.hasComponent("door") ||
            gameEntity.hasComponent("pushWall") &&
            this._worldMap.getDoorState(checkMapX, checkMapY) == DoorState.OPEN) { //Open door in front of camera
            this._worldMap.setDoorState(checkMapX, checkMapY, DoorState.CLOSING);
            return true;
        }

        gameEntity = this._worldMap.getPosition(checkMapX2, checkMapY2);

        if (gameEntity && (gameEntity.hasComponent("door") ||
            gameEntity.hasComponent("pushWall") &&
            this._worldMap.getDoorState(checkMapX2, checkMapY2) == DoorState.OPEN)) {
            this._worldMap.setDoorState(checkMapX2, checkMapY2, DoorState.CLOSING);
            return true;
        }

        gameEntity = this._worldMap.getPosition(Math.floor(camera.xPos), Math.floor(camera.yPos));

        if (gameEntity && gameEntity.hasComponent("door")) { //Avoid getting stuck in doors
            this._worldMap.setDoorState(Math.floor(camera.xPos), Math.floor(camera.yPos), DoorState.OPENING);
        }


        return false;
    }

}
