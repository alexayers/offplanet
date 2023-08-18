import {GameSystem, processComponents} from "@lib/ecs/gameSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";
import {DamagedComponent} from "@lib/ecs/components/damagedComponent";
import {World} from "@lib/rendering/rayCaster/world";
import {CanDamageComponent} from "@lib/ecs/components/canDamageComponent";
import {DrillComponent} from "../components/drillComponent";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {WhenDestroyedComponent} from "../components/whenDestroyedComponent";


export class DrillSystem implements GameSystem {

    private _world: World = World.getInstance();
    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();

    @processComponents(["camera", "drilling"], ["drilling"])
    processEntity(gameEntity: GameEntity): void {

        let camera: CameraComponent = gameEntity.getComponent("camera") as CameraComponent;
        let inventory: InventoryComponent = gameEntity.getComponent("inventory") as InventoryComponent;
        let holdingItem: GameEntity = inventory.getCurrentItem();

        if (holdingItem && holdingItem.hasComponent("drill")) {

            if (this.canDamage(camera)) {
                this.damageObject(camera, holdingItem);
            }
        }


    }

    canDamage(camera: CameraComponent): boolean {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("canDamage")) {

            let canDamage: CanDamageComponent = gameEntity.getComponent("canDamage") as CanDamageComponent;

            if (!gameEntity.hasComponent("damaged")) {

                let newEntity = this._gameEntityRegistry.getEntity(gameEntity.name);
                newEntity.addComponent(new DamagedComponent(0, canDamage.sprite))
                this._world.placeTile(checkMapX, checkMapY, newEntity);
            }

            return true;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("canDamage")) {

            let canDamage: CanDamageComponent = gameEntity.getComponent("canDamage") as CanDamageComponent;

            if (!gameEntity.hasComponent("damaged")) {
                let newEntity = this._gameEntityRegistry.getEntity(gameEntity.name);
                newEntity.addComponent(new DamagedComponent(0, canDamage.sprite))
                this._world.placeTile(checkMapX2, checkMapY2, newEntity);
            }

            return true;
        }

        return false;
    }

    damageObject(camera: CameraComponent, repairItem: GameEntity): void {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let checkMapX2: number = Math.floor(camera.xPos + camera.xDir * 2);
        let checkMapY2: number = Math.floor(camera.yPos + camera.yDir * 2);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("damaged")) {

            let drill: DrillComponent = repairItem.getComponent("drill") as DrillComponent;
            let damage: DamagedComponent = gameEntity.getComponent("damaged") as DamagedComponent;
            damage.damage = damage.damage + drill.speed;

            if (damage.damage >= 100) {
                World.getInstance().removeWall(checkMapX, checkMapY);

                if (gameEntity.hasComponent("whenDestroyed")) {
                    let whenDestroyed: WhenDestroyedComponent = gameEntity.getComponent("whenDestroyed") as WhenDestroyedComponent;
                    whenDestroyed.callBack();
                }

            }

            return;
        }

        gameEntity = this._world.getPosition(checkMapX2, checkMapY2);

        if (gameEntity.hasComponent("damaged")) {
            let drill: DrillComponent = repairItem.getComponent("drill") as DrillComponent;
            let damage: DamagedComponent = gameEntity.getComponent("damaged") as DamagedComponent;
            damage.damage = damage.damage + drill.speed;

            if (damage.damage >= 100) {
                World.getInstance().removeWall(checkMapX, checkMapY);

                if (gameEntity.hasComponent("whenDestroyed")) {
                    let whenDestroyed: WhenDestroyedComponent = gameEntity.getComponent("whenDestroyed") as WhenDestroyedComponent;
                    whenDestroyed.callBack();
                }

            }
            return;
        }


    }

}
