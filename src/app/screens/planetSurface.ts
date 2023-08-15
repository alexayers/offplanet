import {GameScreen} from "@lib/application/gameScreen";
import {GameScreenBase} from "./gameScreenBase";
import {World, WorldMap} from "@lib/rendering/rayCaster/world";
import {GameEntity} from "@lib/ecs/gameEntity";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {GameEntityBuilder} from "@lib/ecs/gameEntityBuilder";
import {WallComponent} from "@lib/ecs/components/wallComponent";
import {SpriteComponent} from "@lib/ecs/components/spriteComponent";
import {Sprite} from "@lib/rendering/sprite";
import {FloorComponent} from "@lib/ecs/components/floorComponent";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {VelocityComponent} from "@lib/ecs/components/velocityComponent";
import {GlobalState} from "@lib/application/globalState";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {RayCastRenderSystem} from "@lib/ecs/system/render/rayCastRenderSystem";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {getRandomBetween} from "@lib/utils/mathUtils";
import {StormRenderSystem} from "../system/stormRenderSystem";
import {CanInteractComponent} from "@lib/ecs/components/canInteractComponent";
import {AnimatedSprite} from "@lib/rendering/animatedSprite";
import {WindowWidget} from "@lib/ui/windowWidget";
import {LabelWidgetBuilder} from "@lib/ui/labelWidget";
import {DamagedComponent} from "@lib/ecs/components/damagedComponent";
import {CanDamageComponent} from "@lib/ecs/components/canDamageComponent";
import {OxygenComponent} from "../components/oxygenComponent";
import {HelmetRenderSystem} from "../system/helmetRenderSystem";
import {WhenRepairedComponent} from "../components/whenRepairedComponent";
import {logger, LogType} from "@lib/utils/loggerUtils";
import {CanHaveMessage} from "../components/canHaveMessage";
import {ButtonWidget, ButtonWidgetBuilder} from "@lib/ui/buttonWidget";
import {OnPowerAnimatedSpriteComponent} from "../components/onPowerAnimatedSpriteComponent";
import {WhenDestroyedComponent} from "../components/whenDestroyedComponent";
import {OnPowerLossSpriteComponent} from "../components/onPowerLossSpriteComponent";

export class PlanetSurface extends GameScreenBase implements GameScreen {


    protected _airLockComputer: WindowWidget;

    constructor() {
        super();
    }


    init(): void {

        GlobalState.createState("powerSupplyFunctional", false);

        this.createTranslationMap();
        this.createGameMap();

        this._camera = new Camera(65, 59, 0, 0.9, 0.66);

        this._player = new GameEntityBuilder("player")
            .addComponent(this.createInventory())
            .addComponent(new OxygenComponent(50, 100))
            .addComponent(new CameraComponent(this._camera))
            .addComponent(new VelocityComponent(0, 0))
            .build();

        this._gameEntityRegistry.registerSingleton(this._player);

        this._renderSystems.push(
            new RayCastRenderSystem()
        );

        this._postRenderSystems.push(new StormRenderSystem());
        this._postRenderSystems.push(new HelmetRenderSystem());

        this.powerGeneration();
    }



    createGameMap() : void {

        let grid: Array<number> = [];

        for (let y: number = 0; y < 128; y++) {
            for (let x: number = 0; x < 128; x++) {
                if (y == 0 || y == 127 || x == 0 || x == 127) {
                    grid.push(1);
                } else {

                    if (getRandomBetween(1, 100) < 10) {
                        grid.push(2);
                    } else {
                        grid.push(0);
                    }
                }
            }
        }

        let world: World = World.getInstance();

        let spaceStation: Array<number> = [
            7, 0, 0, 0, 0,
            3, 3, 5, 3, 3,
            3, 0, 0, 0, 3,
            3, 0, 0, 0, 3,
            3, 3, 3, 3, 3,
        ];

        let i: number = 0;
        let offsetY: number = 64;
        let offsetX: number = 64;
        let spaceStationWidth: number = 5;
        let spaceStationHeight: number = 5;

        for (let y: number = offsetY - 3; y < offsetY + spaceStationHeight + 3; y++) {
            for (let x: number = offsetX - 3; x < offsetX + spaceStationWidth + 3; x++) {
                let pos: number = x + (y * 128);
                grid[pos] = 0;
                i++;
            }
        }

        i = 0;

        for (let y: number = offsetY; y < offsetY + spaceStationHeight; y++) {
            for (let x: number = offsetX; x < offsetX + spaceStationWidth; x++) {
                let pos: number = x + (y * 128);
                grid[pos] = spaceStation[i];
                i++;
            }
        }


        let worldMap: WorldMap = {
            grid: grid,
            skyColor: Colors.BLACK(),
            skyBox: new Sprite(512, 512, require("../../assets/images/skyBox.png")),
            floorColor: new Color(61, 27, 24),
            translationTable: this._translationTable,
            width: 128,
            height: 128,
            lightRange: 3.5
        }

        world.loadMap(worldMap);
    }

    createTranslationMap() : void {
        let floor: GameEntity = new GameEntityBuilder("floor")
            .addComponent(new FloorComponent())
            .build();

        this.addEntity(0, floor);

        let wall: GameEntity = new GameEntityBuilder("wall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/planetWall.png"))))
            .build();

        this.addEntity(1, wall);


        let rock: GameEntity = new GameEntityBuilder("rock")
            .addComponent(new WallComponent())
            .addComponent(new CanDamageComponent(new Sprite(0, 0, require("../../assets/images/damageRock.png"))))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/rock.png"))))
            .build();


        this.addEntity(2, rock);


        let spaceStationWall: GameEntity = new GameEntityBuilder("spaceStationWall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/spaceStationWall.png"))))
            .build();

        this.addEntity(3, spaceStationWall);

        let airLockWarning: GameEntity = new GameEntityBuilder("airLockWarning")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airLockWarning.png"))))
            .build();

        this.addEntity(4, airLockWarning);

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

        this.addEntity(5, airLockDoor);

        this._requiresPower.push(airLockDoor);

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

        this.addEntity(6, airLockComputer);

        let generator: GameEntity = new GameEntityBuilder("generator")
            .addComponent(new WallComponent())
            .addComponent(new CanInteractComponent())
            .addComponent(new CanDamageComponent(new Sprite(0, 0, require("../../assets/images/damagedGenerator.png"))))
            .addComponent(new WhenDestroyedComponent(() : void => {
                GlobalState.updateState("powerSupplyFunctional", false);
            }))
            .addComponent(new WhenRepairedComponent((): void => {
                GlobalState.updateState("powerSupplyFunctional", true);
                logger(LogType.INFO, "Power restored");
            }))
            .addComponent(new DamagedComponent(100, new Sprite(128, 128, require("../../assets/images/damagedGenerator.png"))))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/generator.png"))))
            .build();

        this.addEntity(7, generator);

        let doorFrame: GameEntity = new GameEntityBuilder("doorFrame")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/doorFrame.png"))))
            .build();

        this._gameEntityRegistry.registerSingleton(doorFrame);
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



    onEnter(): void {
    }

    onExit(): void {
    }





}
