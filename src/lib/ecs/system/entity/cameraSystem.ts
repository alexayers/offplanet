import {GameSystem} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {VelocityComponent} from "@lib/ecs/components/velocityComponent";
import {Performance} from "@lib/rendering/rayCaster/performance";


export class CameraSystem implements GameSystem {

    private _turnSpeed: number = 0.2;

    processEntity(gameEntity: GameEntity): void {

        if (gameEntity.hasComponent("camera")) {

            let turnSpeed: number = this._turnSpeed * Performance.deltaTime;

            let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;
            let velocity: VelocityComponent = gameEntity.getComponent("velocity") as VelocityComponent;

            camera.camera.move(velocity.velX, velocity.velY)

            if (velocity.rotateRight) {
                camera.camera.rotate(-turnSpeed);
            }

            if (velocity.rotateLeft) {
                camera.camera.rotate(turnSpeed);
            }

            velocity.velX = 0;
            velocity.velY = 0;
            velocity.rotateLeft = false;
            velocity.rotateRight = false;
        }

    }

}
