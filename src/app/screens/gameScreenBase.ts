import {GameSystem} from "@lib/ecs/gameSystem";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {CameraSystem} from "@lib/ecs/system/entity/cameraSystem";
import {InteractionSystem} from "@lib/ecs/system/entity/interactionSystem";
import {PickUpDropSystem} from "@lib/ecs/system/entity/pickUpDropSystem";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {WidgetManager} from "@lib/ui/widgetManager";
import {RepairSystem} from "../system/repairSystem";
import {DrillSystem} from "../system/drillSystem";
import {Performance} from "@lib/rendering/rayCaster/performance";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {VelocityComponent} from "@lib/ecs/components/velocityComponent";
import {GlobalState} from "@lib/application/globalState";
import {KeyboardInput} from "@lib/input/keyboard";
import {DrillingActionComponent} from "../components/drillingActionComponent";
import {InteractingActionComponent} from "@lib/ecs/components/interactions/interactingActionComponent";
import {MouseButton} from "@lib/input/mouse";
import {Widget} from "@lib/ui/widget";
import {GameEntityBuilder} from "@lib/ecs/gameEntityBuilder";
import {DrillComponent} from "../components/drillComponent";
import {InventorySpriteComponent} from "../components/inventorySpriteComponent";
import {Sprite} from "@lib/rendering/sprite";
import {HoldingSpriteComponent} from "@lib/ecs/components/holdingSpriteComponent";
import {RepairComponent} from "../components/repairComponent";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {Color} from "@lib/primatives/color";
import {Fonts} from "../fonts";


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
    protected _lastXPos: number;
    protected _lastYPos: number;
    protected _moves: number = 0;
    protected _widgetManager: WidgetManager = new WidgetManager();
    protected _openButtons: Array<Widget> = [];
    protected _requiresPower: Array<GameEntity> = [];
    protected _useTool: boolean = false;
    protected _translationTable: Map<number, GameEntity> = new Map<number, GameEntity>();

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

        this._gameSystems.push(
            new DrillSystem()
        )

    }

    sway(): void {
        if (!this._updateSway) {

            let sway: number = this._moveSway % (Math.PI * 2);
            let diff: number = 0;
            if (sway - Math.PI <= 0) diff = -Math.PI / 30;
            else diff = Math.PI / 30;

            if (sway + diff < 0 || sway + diff > Math.PI * 2) {
                this._moveSway -= sway;
            } else {
                this._moveSway += diff;
            }
            return;
        }

        if (this._moves > 1) {
            this._moveSway += Math.PI / 25;
            this._moveSway %= Math.PI * 8;
        }

    }

    keyboard(keyCode: number): void {

        let moveSpeed: number = this._moveSpeed * Performance.deltaTime;
        let moveX: number = 0;
        let moveY: number = 0;

        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");
        let inventory: InventoryComponent = player.getComponent("inventory") as InventoryComponent;
        let camera: CameraComponent = player.getComponent("camera") as CameraComponent;

        let velocity: VelocityComponent = player.getComponent("velocity") as VelocityComponent;



        if (GlobalState.getState(`KEY_${KeyboardInput.ONE}`)) {
            inventory.currentItemIdx = 0;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.TWO}`)) {
            inventory.currentItemIdx = 1;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.THREE}`)) {
            inventory.currentItemIdx = 2;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.FOUR}`)) {
            inventory.currentItemIdx = 3;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.FIVE}`)) {
            inventory.currentItemIdx = 4;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.SIX}`)) {
            inventory.currentItemIdx = 5;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.UP}`)) {
            moveX += camera.xDir;
            moveY += camera.yDir;
            this._updateSway = true;
            this._moves++;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.DOWN}`)) {
            moveX -= camera.xDir;
            moveY -= camera.yDir;
            this._updateSway = true;
            this._moves++;
            this.closeButtons();
        }
        if (GlobalState.getState(`KEY_${KeyboardInput.LEFT}`)) {
            velocity.rotateLeft = true;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.RIGHT}`)) {
            velocity.rotateRight = true;
            this.closeButtons();
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.SPACE}`)) {


            let inventory: InventoryComponent = this._player.getComponent("inventory") as InventoryComponent;
            let holdingItem: GameEntity = inventory.getCurrentItem();


            if (holdingItem.hasComponent("drill")) {
                player.addComponent(new DrillingActionComponent())
            } else {
                player.addComponent(new InteractingActionComponent())
            }

            this._useTool = true;
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.SHIFT}`)) {
            moveX *= moveSpeed * 2;
            moveY *= moveSpeed * 2;
        } else {
            moveX *= moveSpeed;
            moveY *= moveSpeed;
        }

        velocity.velX = moveX;
        velocity.velY = moveY;


        this._lastXPos = this._camera.xPos;
        this._lastYPos = this._camera.yPos;

    }

    logicLoop(): void {
        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");

        this._gameSystems.forEach((gameSystem: GameSystem) => {
            gameSystem.processEntity(player)
        });


        if (this._camera.xPos == this._lastXPos && this._camera.yPos == this._lastYPos) {
            this._updateSway = false;
            this._moves = 0;
        }
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
        this._widgetManager.mouseClick(x, y, mouseButton);
    }

    mouseMove(x: number, y: number): void {
        this._widgetManager.mouseMove(x, y);
    }

    closeButtons() : void {
        this._openButtons.forEach((widget: Widget) => {
            this._widgetManager.delete(widget.id);
        });
    }


    createInventory() : InventoryComponent {
        let inventory: InventoryComponent = new InventoryComponent(6);

        let drill: GameEntity = new GameEntityBuilder("drill")
            .addComponent(new DrillComponent(10))
            .addComponent(new InventorySpriteComponent(new Sprite(0, 0, require("../../assets/images/drillInventory.png"))))
            .addComponent(new HoldingSpriteComponent(new Sprite(0, 0, require("../../assets/images/drill.png"))))
            .build();

        let wrench: GameEntity = new GameEntityBuilder("wrench")
            .addComponent(new RepairComponent(50))
            .addComponent(new InventorySpriteComponent(new Sprite(0, 0, require("../../assets/images/wrenchInventory.png"))))
            .addComponent(new HoldingSpriteComponent(new Sprite(0, 0, require("../../assets/images/wrench.png"))))
            .build()

        inventory.addItem(drill);
        inventory.addItem(wrench);
        return inventory;
    }

    renderLoop(): void {

        this._renderSystems.forEach((renderSystem: GameRenderSystem):
        void => {
            renderSystem.process();
        });

        this._translationTable.forEach((gameEntity: GameEntity): void => {
            if (gameEntity.hasComponent("animatedSprite")) {
                let animatedSprite: AnimatedSpriteComponent = gameEntity.getComponent("animatedSprite") as AnimatedSpriteComponent;
                animatedSprite.animatedSprite.nextFrame();
            }
        });


        this.sway();
        this.holdingItem()

        this._postRenderSystems.forEach((renderSystem: GameRenderSystem):
        void => {
            renderSystem.process();
        });


        this._widgetManager.render();

        this.wideScreen();

    }

    holdingItem(): void {
        let inventory: InventoryComponent = this._player.getComponent("inventory") as InventoryComponent;
        let holdingItem: GameEntity = inventory.getCurrentItem();

        if (holdingItem) {

            let xOffset: number = Math.sin(this._moveSway / 2) * 40,
                yOffset: number = Math.cos(this._moveSway) * 30;

            let holdingItemSprite: HoldingSpriteComponent = holdingItem.getComponent("holdingSprite") as HoldingSpriteComponent;
            holdingItemSprite.sprite.render(200 + xOffset, 110 + yOffset, 512, 512);
        }

    }

    addEntity(id: number, gameEntity): void {
        this._translationTable.set(id, gameEntity);
        this._gameEntityRegistry.register(gameEntity);
    }

    wideScreen(): void {
        Renderer.rect(0, 0, Renderer.getCanvasWidth(), 40, Colors.BLACK());


        Renderer.rect(0, Renderer.getCanvasHeight() - 60, Renderer.getCanvasWidth(), 40, Colors.BLACK());

        let offsetX: number = 550;
        let offsetY: number = 70;

        let inventory: InventoryComponent = this._player.getComponent("inventory") as InventoryComponent;
        let inventoryBoxSize: number = 32;

        for (let i: number = 0; i < inventory.maxItems; i++) {

            if (i == inventory.currentItemIdx) {
                Renderer.rect(offsetX - 1, Renderer.getCanvasHeight() - (offsetY + 1), inventoryBoxSize + 2, inventoryBoxSize + 2, Colors.WHITE());
            } else {
                Renderer.rect(offsetX - 1, Renderer.getCanvasHeight() - (offsetY + 1), inventoryBoxSize + 2, inventoryBoxSize + 2, Colors.BLACK());
            }

            Renderer.rect(offsetX, Renderer.getCanvasHeight() - offsetY, inventoryBoxSize, inventoryBoxSize, new Color(190, 190, 190, 0.45));

            if (inventory.inventory[i] != null) {
                let inventorySprite: InventorySpriteComponent = inventory.inventory[i].getComponent("inventorySprite") as InventorySpriteComponent;
                Renderer.renderImage(inventorySprite.sprite.image, offsetX, Renderer.getCanvasHeight() - offsetY, inventoryBoxSize - 4, inventoryBoxSize - 4);
            }

            offsetX += inventoryBoxSize + 6;
        }


    }


    debug(): void {
        Renderer.print(`X: ${this._camera.xPos} Y: ${this._camera.yPos}`, 10, 20, {
            family: Fonts.Oxanium,
            size: 10,
            color: Colors.WHITE()
        })
        Renderer.print(`dirX: ${this._camera.xDir} dirY: ${this._camera.yDir}`, 10, 40, {
            family: Fonts.Oxanium,
            size: 10,
            color: Colors.WHITE()
        })
    }

}
