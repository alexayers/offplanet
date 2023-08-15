import {GameScreen} from "@lib/application/gameScreen";
import {MouseButton} from "@lib/input/mouse";
import {GameScreenBase} from "./gameScreenBase";
import {World, WorldMap} from "@lib/rendering/rayCaster/world";
import {GameEntity} from "@lib/ecs/gameEntity";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {GameEntityBuilder} from "@lib/ecs/gameEntityBuilder";
import {WallComponent} from "@lib/ecs/components/wallComponent";
import {SpriteComponent} from "@lib/ecs/components/spriteComponent";
import {Sprite} from "@lib/rendering/sprite";
import {FloorComponent} from "@lib/ecs/components/floorComponent";
import {InventoryComponent} from "@lib/ecs/components/inventoryComponent";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {VelocityComponent} from "@lib/ecs/components/velocityComponent";
import {GlobalState} from "@lib/application/globalState";
import {KeyboardInput} from "@lib/input/keyboard";
import {InteractingActionComponent} from "@lib/ecs/components/interactions/interactingActionComponent";
import {Performance} from "@lib/rendering/rayCaster/performance";
import {GameSystem} from "@lib/ecs/gameSystem";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {RayCastRenderSystem} from "@lib/ecs/system/render/rayCastRenderSystem";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {getRandomBetween} from "@lib/utils/mathUtils";
import {StormRenderSystem} from "../system/stormRenderSystem";
import {CanInteractComponent} from "@lib/ecs/components/canInteractComponent";
import {HoldingSpriteComponent} from "@lib/ecs/components/holdingSpriteComponent";
import {AnimatedSprite} from "@lib/rendering/animatedSprite";
import {WindowWidget, WindowWidgetBuilder} from "@lib/ui/windowWidget";
import {PanelWidgetBuilder} from "@lib/ui/panelWidget";
import {LabelWidgetBuilder} from "@lib/ui/labelWidget";
import {DamagedComponent} from "@lib/ecs/components/damagedComponent";

export class PlanetSurface extends GameScreenBase implements GameScreen {

    private _translationTable: Map<number, GameEntity> = new Map<number, GameEntity>();
    private _hand: Sprite = new Sprite(0,0, require("../../assets/images/hands.png"));
    protected _airLockComputer: WindowWidget;
    private _useTool : boolean = false;


    constructor() {
        super();
    }

    initUI() : void {

        this._airLockComputer = new WindowWidgetBuilder(150,150,350,200)
            .withTitle("AirLock Computer")
            .addWidget(
                new PanelWidgetBuilder(0,-5, 350,200)
                    .withColor(new Color(50, 60, 80))
                    .withWidget(new LabelWidgetBuilder(40,80)
                        .withLabel("Offline: Not Enough Power")
                        .withFont({family: Fonts.Oxanium, size: 20, color: Colors.WHITE()})
                        .build())
                    .build()
            )
            .build();

        this._airLockComputer.close();
        this._widgetManager.register(this._airLockComputer);

    }

    init(): void {

        this.initUI();

        let grid: Array<number> = [];

        for (let y : number = 0; y < 128; y++) {
            for (let x:number = 0; x < 128; x++) {
                if (y ==0 || y == 127 || x == 0 || x == 127) {
                    grid.push(1);
                } else {

                    if (getRandomBetween(1,100) < 10) {
                        grid.push(2);
                    } else {
                        grid.push(0);
                    }
                }
            }
        }


        let world : World = World.getInstance();

        let floor: GameEntity = new GameEntityBuilder("floor")
            .addComponent(new FloorComponent())
            .build();

        this._translationTable.set(0, floor);

        let wall: GameEntity = new GameEntityBuilder("wall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/planetWall.png"))))
            .build();

        this._translationTable.set(1,wall);

        let rock: GameEntity = new GameEntityBuilder("rock")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/rock.png"))))
            .build();

        this._translationTable.set(2, rock);


        let spaceStationWall: GameEntity = new GameEntityBuilder("spaceStationWall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/spaceStationWall.png"))))
            .build();

        this._translationTable.set(3, spaceStationWall);

        let airLockWarning: GameEntity = new GameEntityBuilder("airLockWarning")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airLockWarning.png"))))
            .build();

        this._translationTable.set(4, airLockWarning);

        let airLockDoor: GameEntity = new GameEntityBuilder("airLockDoor")
            .addComponent(new WallComponent())
            .addComponent(new CanInteractComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airLockDoor.png"))))
            .build();

        this._translationTable.set(5, airLockDoor);




        let airLockComputer: GameEntity = new GameEntityBuilder("airLockComputer")
            .addComponent(new WallComponent())
            .addComponent(new CanInteractComponent())
            .addComponent(new AnimatedSpriteComponent(new AnimatedSprite(128, 128,
                [
                    require("../../assets/images/airLockComputer.png"),
                    require("../../assets/images/airLockComputer1.png"),
                    require("../../assets/images/airLockComputer2.png"),
                    require("../../assets/images/airLockComputer3.png"),
                    require("../../assets/images/airLockComputer4.png"),
                    require("../../assets/images/airLockComputer5.png"),
                    require("../../assets/images/airLockComputer6.png"),
                ])))
            .build();

        this._translationTable.set(6, airLockComputer);


        let generator: GameEntity = new GameEntityBuilder("generator")
            .addComponent(new WallComponent())
            .addComponent(new CanInteractComponent())
            .addComponent(new DamagedComponent(100,new Sprite(128, 128,require("../../assets/images/damagedGenerator.png"))))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/generator.png"))))
            .build();

        this._translationTable.set(7, generator);


        let spaceStation : Array<number> = [
            7,0,0,0,0,
            3,6,5,3,3,
            3,0,0,0,3,
            3,0,0,0,3,
            3,3,3,3,3,
        ];

        let i : number = 0;
        let offsetY: number = 64;
        let offsetX: number = 64;
        let spaceStationWidth: number = 5;
        let spaceStationHeight: number = 5;

        for (let y : number = offsetY - 3; y < offsetY + spaceStationHeight + 3; y++) {
            for (let x: number = offsetX - 3; x < offsetX + spaceStationWidth + 3; x++) {
                let pos: number = x + (y * 128);
                grid[pos] = 0;
                i++;
            }
        }

        i = 0;

        for (let y : number = offsetY; y < offsetY + spaceStationHeight; y++) {
            for (let x: number = offsetX; x < offsetX + spaceStationWidth; x++) {
                let pos: number = x + (y * 128);
                grid[pos] = spaceStation[i];
                i++;
            }
        }


        let worldMap: WorldMap = {
            grid: grid,
            skyColor: Colors.BLACK(),
            skyBox: new Sprite(512,512, require("../../assets/images/skyBox.png")),
            floorColor: new Color(61, 27, 24),
            translationTable: this._translationTable,
            width: 128,
            height: 128,
            lightRange: 3.5
        }

        world.loadMap(worldMap);

        this._camera = new Camera(65, 59, 0, 0.9, 0.66);

        let inventory : InventoryComponent = new InventoryComponent(6);


        this._player = new GameEntityBuilder("player")
            .addComponent(inventory)
            .addComponent(new CameraComponent(this._camera))
            .addComponent(new VelocityComponent(0, 0))
            .build();

        this._gameEntityRegistry.registerSingleton(this._player);

        this._renderSystems.push(
            new RayCastRenderSystem()
        );

        this._postRenderSystems.push(new StormRenderSystem())
    }

    keyboard(keyCode: number): void {

        let moveSpeed: number = this._moveSpeed * Performance.deltaTime;
        let moveX: number = 0;
        let moveY: number = 0;

        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");

        let camera: CameraComponent = player.getComponent("camera") as CameraComponent;

        let velocity: VelocityComponent = player.getComponent("velocity") as VelocityComponent;

        if (GlobalState.getState(`KEY_${KeyboardInput.UP}`)) {
            moveX += camera.xDir;
            moveY += camera.yDir;
            this._updateSway = true;
            this._moves++;
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.DOWN}`)) {
            moveX -= camera.xDir;
            moveY -= camera.yDir;
            this._updateSway = true;
            this._moves++;
        }
        if (GlobalState.getState(`KEY_${KeyboardInput.LEFT}`)) {
            velocity.rotateLeft = true;
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.RIGHT}`)) {
            velocity.rotateRight = true;
        }

        if (GlobalState.getState(`KEY_${KeyboardInput.SPACE}`)) {
            player.addComponent(new InteractingActionComponent())
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
        this._widgetManager.mouseClick(x,y,mouseButton);
    }

    mouseMove(x: number, y: number): void {
        this._widgetManager.mouseMove(x,y);
    }

    onEnter(): void {
    }

    onExit(): void {
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

        this.debug();

    }

    holdingItem() : void {
        let inventory : InventoryComponent = this._player.getComponent("inventory") as InventoryComponent;
        let holdingItem : GameEntity = inventory.getCurrentItem();

        if (holdingItem) {

            let xOffset : number = Math.sin(this._moveSway/2) * 40,
                yOffset: number = Math.cos(this._moveSway) * 30;

            let holdingItemSprite : HoldingSpriteComponent = holdingItem.getComponent("holdingSprite") as HoldingSpriteComponent;
            holdingItemSprite.sprite.render(200 + xOffset,110 + yOffset, 512,512);
        } else {

            let xOffset : number = Math.sin(this._moveSway/2) * 40,
                yOffset: number = Math.cos(this._moveSway) * 30;


            if (this._useTool) {
                this._hand.render(400 + xOffset,150 + yOffset, 520,520);
                this._useTool = false;
            } else {
                this._hand.render(400 + xOffset,150 + yOffset, 512,512);
            }

        }
    }

    wideScreen() : void {
        Renderer.rect(0, 0, Renderer.getCanvasWidth(),40, Colors.BLACK());


        Renderer.rect(0, Renderer.getCanvasHeight() - 60, Renderer.getCanvasWidth(),40, Colors.BLACK());

    }

    debug() : void {
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
