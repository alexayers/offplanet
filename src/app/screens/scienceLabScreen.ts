import {GameScreen} from "@lib/application/gameScreen";
import {GameScreenBase} from "./gameScreenBase";
import {GameEntity} from "@lib/ecs/gameEntity";
import {GameEntityBuilder} from "@lib/ecs/gameEntityBuilder";
import {FloorComponent} from "@lib/ecs/components/floorComponent";
import {WallComponent} from "@lib/ecs/components/wallComponent";
import {SpriteComponent} from "@lib/ecs/components/spriteComponent";
import {Sprite} from "@lib/rendering/sprite";
import {getRandomBetween} from "@lib/utils/mathUtils";
import {World, WorldMap} from "@lib/rendering/rayCaster/world";
import {Colors} from "@lib/utils/colorUtils";
import {Color} from "@lib/primatives/color";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {OxygenComponent} from "../components/oxygenComponent";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {VelocityComponent} from "@lib/ecs/components/velocityComponent";
import {RayCastRenderSystem} from "@lib/ecs/system/render/rayCastRenderSystem";
import {HelmetRenderSystem} from "../system/helmetRenderSystem";
import {MissionRenderSystem} from "../system/missionRenderSystem";
import {GlobalState} from "@lib/application/globalState";
import {OnPowerAnimatedSpriteComponent} from "../components/onPowerAnimatedSpriteComponent";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {OnPowerLossSpriteComponent} from "../components/onPowerLossSpriteComponent";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {CanInteractComponent} from "@lib/ecs/components/canInteractComponent";
import {ButtonWidget, ButtonWidgetBuilder} from "@lib/ui/buttonWidget";
import {Renderer} from "@lib/rendering/renderer";
import {LabelWidgetBuilder} from "@lib/ui/labelWidget";
import {logger, LogType} from "@lib/utils/loggerUtils";
import {CanHaveMessage} from "../components/canHaveMessage";
import {Fonts} from "../fonts";
import {AnimatedSprite} from "@lib/rendering/animatedSprite";
import {CanDamageComponent} from "@lib/ecs/components/canDamageComponent";
import {BuildingRenderSystem} from "../system/buildingRenderSystem";
import {TransparentComponent} from "@lib/ecs/components/transparentComponent";


export class ScienceLabScreen extends GameScreenBase implements GameScreen {

    init(): void {

        this.createTranslationMap();
        this.createGameMap();
        this.createPlayer();

        this._renderSystems.push(
            new RayCastRenderSystem()
        );

        this._postRenderSystems.push(new HelmetRenderSystem());
        this._postRenderSystems.push(new MissionRenderSystem());
        this._postRenderSystems.push(new BuildingRenderSystem());


        this.powerGeneration();
    }

    powerGeneration() : void {
        GlobalState.registerChangeListener("powerSupplyFunctional", ()=> {
            let powerSupplyFunctional = GlobalState.getState("powerSupplyFunctional");

            if (powerSupplyFunctional == true) {

                this._requiresPower.forEach((gameEntity : GameEntity) => {
                    gameEntity.removeComponent("sprite");

                    let onPowerAnimatedSpriteComponent : OnPowerAnimatedSpriteComponent = gameEntity.getComponent("onPowerAnimatedSprite") as OnPowerAnimatedSpriteComponent;

                    gameEntity.addComponent(new AnimatedSpriteComponent(onPowerAnimatedSpriteComponent.animatedSprite));
                });
            } else if (powerSupplyFunctional == false) {

                this._requiresPower.forEach((gameEntity : GameEntity) => {
                    gameEntity.removeComponent("animatedSprite");
                    let onPowerLossSpriteComponent : OnPowerLossSpriteComponent = gameEntity.getComponent("onPowerLossSprite") as OnPowerLossSpriteComponent;
                    gameEntity.addComponent(new SpriteComponent(onPowerLossSpriteComponent.sprite));
                });

            }

        })
    }

    createPlayer() : void {
        this._camera = new Camera(6.5, 1.8, 0, 1, 0.66);

        this._player = new GameEntityBuilder("player")
            .addComponent(this.createInventory())
            .addComponent(new OxygenComponent(50, 100))
            .addComponent(new CameraComponent(this._camera))
            .addComponent(new VelocityComponent(0, 0))
            .build();

        this._gameEntityRegistry.registerSingleton(this._player);
    }

    createGameMap() : void {
        let grid: Array<number> = [];

        let width: number = 20;
        let height: number = 20;

        /*
        for (let y: number = 0; y < height; y++) {
            for (let x: number = 0; x < width; x++) {
                if (y == 0 || y == height - 1 || x == 0 || x == width - 1) {
                    grid.push(1);
                } else {
                    grid.push(0);
                }
            }
        }

         */

        grid = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,2,0,0,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,2,0,0,1,1,1,1,2,1,2,1,1,1,1,1,1,2,2,2,2,2,0,0,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1,1,1,2,0,0,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,1,1,2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,0,0,2,2,1,2,2,2,2,1,2,2,2,1,1,2,2,1,2,2,0,0,2,2,1,2,2,2,2,1,2,2,2,1,1,1,1,1,1,1,0,0,2,2,1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,0,0,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,0,0,2,1,1,1,2,2,1,2,2,1,2,1,1,1,2,1,1,1,0,0,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,0,0,2,2,1,2,2,1,1,1,2,1,2,2,1,2,2,2,1,2,0,0,1,1,1,1,2,1,1,1,2,1,2,2,1,2,2,2,1,2,0,0,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,2,2,1,2,2,1,2,2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]












        let airLockDoor: GameEntity = new GameEntityBuilder("airLockDoor")
            .addComponent(new WallComponent())
            .addComponent(new OnPowerLossSpriteComponent(new Sprite(128, 128, require("../../assets/images/airLockDoor.png"))))
            .addComponent(new CanInteractComponent(()=>{

                let value: boolean = GlobalState.getState("powerSupplyFunctional");

                if (value == true) {
                    let enterLabButton: ButtonWidget = new ButtonWidgetBuilder(Renderer.getCanvasWidth() / 2, Renderer.getCanvasHeight() / 2, 180, 25)
                        .withId("enterScienceLabButton")
                        .withLabel(new LabelWidgetBuilder(10, 2)
                            .withLabel("Press <Space> to Enter")
                            .build())
                        .withCallBack(() => {
                            logger(LogType.INFO, "You want to enter")
                        })
                        .build()

                    this._widgetManager.register(enterLabButton);

                    this._openButtons.push(enterLabButton);
                }
            }))
            .addComponent(new CanHaveMessage(() => {

                let value: boolean = GlobalState.getState("powerSupplyFunctional");

                if (value == false) {

                    Renderer.rect((Renderer.getCanvasWidth() / 2) - 10, (Renderer.getCanvasHeight() / 2) - 20, 105, 40, Colors.BLACK())

                    Renderer.print("No Power", Renderer.getCanvasWidth() / 2, Renderer.getCanvasHeight() / 2, {
                        family: Fonts.Oxanium,
                        size: 20,
                        color: Colors.WHITE()
                    });
                }
            }))
            .addComponent(new OnPowerAnimatedSpriteComponent(new AnimatedSprite(0,0,
                [
                    require("../../assets/images/airLockDoorPowered.png"),
                    require("../../assets/images/airLockDoorPowered1.png"),
                    require("../../assets/images/airLockDoorPowered2.png"),
                    require("../../assets/images/airLockDoorPowered3.png"),
                    require("../../assets/images/airLockDoorPowered4.png"),
                    require("../../assets/images/airLockDoorPowered5.png"),
                    require("../../assets/images/airLockDoorPowered6.png"),
                    require("../../assets/images/airLockDoorPowered7.png"),
                    require("../../assets/images/airLockDoorPowered8.png"),
                    require("../../assets/images/airLockDoorPowered8.png"),
                    require("../../assets/images/airLockDoorPowered7.png"),
                    require("../../assets/images/airLockDoorPowered6.png"),
                    require("../../assets/images/airLockDoorPowered5.png"),
                    require("../../assets/images/airLockDoorPowered4.png"),
                    require("../../assets/images/airLockDoorPowered3.png"),
                    require("../../assets/images/airLockDoorPowered2.png"),
                    require("../../assets/images/airLockDoorPowered1.png")


                ])))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airLockDoor.png"))))
            .build();

        this.addEntity(600, airLockDoor);

        let pos =6;
        grid[pos] = 600;

        grid[6 + (5 * 20)] = 700;



        let world: World = World.getInstance();

        let worldMap: WorldMap = {
            grid: grid,
            skyColor: Colors.DRKGRAY(),
            floorColor: new Color(120, 120, 120),
            translationTable: this._translationTable,
            width: width,
            height: height,
            lightRange: 7
        }

        world.loadMap(worldMap);
    }

    createTranslationMap() : void {
        let floor: GameEntity = new GameEntityBuilder("floor")
            .addComponent(new FloorComponent())
            .build();

        this.addEntity( 1, floor);

        let wall: GameEntity = new GameEntityBuilder("wall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/spaceStationWall.png"))))
            .build();

        this.addEntity(0, wall);

        let stationWall: GameEntity = new GameEntityBuilder("stationWall")
            .addComponent(new WallComponent())

            .addComponent(new CanDamageComponent(new Sprite(0, 0, require("../../assets/images/damageRock.png"))))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/stationWall.png"))))
            .build();

        this.addEntity(2, stationWall);



        let trans: GameEntity = new GameEntityBuilder("trans")
            .addComponent(new WallComponent())
            .addComponent(new TransparentComponent(0.25))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/spaceStationWall.png"))))
            .build();

        this.addEntity(700, trans);

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

        this.wideScreen();

        this.debug();
    }

}
