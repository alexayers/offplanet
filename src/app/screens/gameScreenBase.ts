import {GameSystem} from "@lib/ecs/gameSystem";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {CameraSystem} from "@lib/ecs/system/entity/cameraSystem";
import {InteractionSystem} from "@lib/ecs/system/entity/interactionSystem";
import {PickUpDropSystem} from "@lib/ecs/system/entity/pickUpDropSystem";
import {RayCastRenderSystem} from "@lib/ecs/system/render/rayCastRenderSystem";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {WidgetManager} from "@lib/ui/widgetManager";
import {RepairSystem} from "../system/repairSystem";


export class GameScreenBase {
    protected _moveSpeed: number = 0.225;
    protected _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();
    protected _gameSystems: Array<GameSystem> = [];
    protected _renderSystems: Array<GameRenderSystem> = [];
    protected _postRenderSystems: Array<GameRenderSystem> = [];
    protected _player: GameEntity;
    protected _camera: Camera;
    protected _moveSway: number = 0;
    protected _updateSway: boolean = false;
    protected _lastXPos : number;
    protected _lastYPos : number;
    protected _moves: number = 0;
    protected _widgetManager: WidgetManager = new WidgetManager();

    constructor() {

        this._gameSystems.push(
            new CameraSystem()
        );

        this._gameSystems.push(
            new InteractionSystem()
        );

        this._gameSystems.push(
            new PickUpDropSystem()
        );

        this._gameSystems.push(
            new RepairSystem()
        );


    }

    sway() : void {
        if (!this._updateSway) {

            let sway: number = this._moveSway % (Math.PI * 2);
            let diff: number = 0;
            if (sway - Math.PI <= 0) diff = -Math.PI/30;
            else diff = Math.PI/30;

            if (sway + diff < 0 || sway + diff > Math.PI * 2) {
                this._moveSway -= sway;
            } else  {
                this._moveSway += diff;
            }
            return;
        }

        if ( this._moves > 1) {
            this._moveSway += Math.PI/25;
            this._moveSway %= Math.PI * 8;
        }

    }

}
