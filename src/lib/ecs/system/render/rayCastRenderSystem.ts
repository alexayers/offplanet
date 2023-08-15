import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {Performance} from "@lib/rendering/rayCaster/performance";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {Renderer} from "@lib/rendering/renderer";
import {RayCaster} from "@lib/rendering/rayCaster/rayCaster";
import {World} from "@lib/rendering/rayCaster/world";
import {GameEntity} from "@lib/ecs/gameEntity";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";


export class RayCastRenderSystem implements GameRenderSystem {

    private _rayCaster: RayCaster = new RayCaster();
    private _worldMap: World = World.getInstance();
    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();

    process(): void {

        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");

        Performance.updateFrameTimes();
        this.moveAll();

        let camera: CameraComponent = player.getComponent("camera") as CameraComponent;

        this._rayCaster.drawSkyBox();

        for (let x: number = 0; x < Renderer.getCanvasWidth(); x++) {
            this._rayCaster.drawWall(camera.camera, x);
        }

        this._rayCaster.drawSpritesAndTransparentWalls(camera.camera);

    }

    moveAll(): void {
        this._worldMap.moveDoors();
    }

}
