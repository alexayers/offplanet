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
import {DamagedComponent} from "@lib/ecs/components/damagedComponent";
import {CanDamageComponent} from "@lib/ecs/components/canDamageComponent";
import {OxygenComponent} from "../components/oxygenComponent";
import {HelmetRenderSystem} from "../system/helmetRenderSystem";
import {WhenRepairedComponent} from "../components/whenRepairedComponent";
import {logger, LogType} from "@lib/utils/loggerUtils";
import {OnPowerAnimatedSpriteComponent} from "../components/onPowerAnimatedSpriteComponent";
import {WhenDestroyedComponent} from "../components/whenDestroyedComponent";
import {OnPowerLossSpriteComponent} from "../components/onPowerLossSpriteComponent";
import {AudioManager} from "@lib/audio/audioManager";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {GameEventBus} from "@lib/gameEvent/gameEventBus";
import {ScreenChangeEvent} from "@lib/gameEvent/screenChangeEvent";
import {Screens} from "./screens";
import {SuitComponent} from "../components/suitComponent";
import {HungerComponent} from "../components/hungerComponent";
import {StaminaComponent} from "../components/staminaComponent";
import {HealthComponent} from "../components/healthComponent";
import {DeathRenderSystem} from "../system/deathRenderSystem";

export class PlanetSurface extends GameScreenBase implements GameScreen {

    private _alphaFade: number = 1;
    private _fadeTick: number = 0;
    private _fadeRate: number = 16;
    private _firstEnter: boolean = true;


    constructor() {
        super();
    }


    init(): void {


        AudioManager.register("rockCrumble", require("../../assets/sound/rockCrumble.wav"));
        AudioManager.register("drilling", require("../../assets/sound/drilling.wav"), true);
        AudioManager.register("dirtStep", require("../../assets/sound/stepDirt.wav"));
        AudioManager.register("error", require("../../assets/sound/error.wav"));
        AudioManager.register("wind", require("../../assets/sound/wind.wav"), true);
        AudioManager.register("generatorRunning", require("../../assets/sound/generatorRunning.wav"), true);

        //GlobalState.createState("powerSupplyFunctional", false);


        this._camera = new Camera(67, 62, -0.66, 0.6, 0.66);

        this._player = new GameEntityBuilder("player")
            .addComponent(this.createInventory())
            .addComponent(new OxygenComponent(50, 100))
            .addComponent(new SuitComponent(100, 100))
            .addComponent(new HungerComponent(50, 100))
            .addComponent(new StaminaComponent(50, 100))
            .addComponent(new HealthComponent(50, 100))
            .addComponent(new CameraComponent(this._camera))
            .addComponent(new VelocityComponent(0, 0))
            .build();

        this._gameEntityRegistry.registerSingleton(this._player);


        this.registerRenderSystems([
            new RayCastRenderSystem()
        ]);

        this.registerPostRenderSystems([
            new StormRenderSystem(),
            new HelmetRenderSystem(),
            new DeathRenderSystem()
        ])


        //    this.powerGeneration();
    }


    createGameMap(): void {

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


    createTranslationMap(): void {
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
            .addComponent(new WhenDestroyedComponent((): void => {
                AudioManager.play("rockCrumble");


            }))
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

        let airLockDoor: GameEntity = new GameEntityBuilder("airLockDoorInterior")
            .addComponent(new WallComponent())
            .addComponent(new CanInteractComponent(() => {
                GameEventBus.publish(new ScreenChangeEvent(Screens.SCIENCE_LAB))
            }))
            .addComponent(new AnimatedSpriteComponent(new AnimatedSprite(0, 0,
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
            .addComponent(new WhenRepairedComponent((): void => {
                //   GlobalState.updateState("powerSupplyFunctional", true);
                AudioManager.play("generatorRunning");
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


    powerGeneration(): void {
        GlobalState.registerChangeListener("powerSupplyFunctional", () => {
            let powerSupplyFunctional = GlobalState.getState("powerSupplyFunctional");

            if (powerSupplyFunctional == true) {

                this._requiresPower.forEach((gameEntity: GameEntity) => {
                    gameEntity.removeComponent("sprite");

                    let onPowerAnimatedSpriteComponent: OnPowerAnimatedSpriteComponent = gameEntity.getComponent("onPowerAnimatedSprite") as OnPowerAnimatedSpriteComponent;

                    gameEntity.addComponent(new AnimatedSpriteComponent(onPowerAnimatedSpriteComponent.animatedSprite));
                });
            } else if (powerSupplyFunctional == false) {

                this._requiresPower.forEach((gameEntity: GameEntity) => {
                    gameEntity.removeComponent("animatedSprite");
                    let onPowerLossSpriteComponent: OnPowerLossSpriteComponent = gameEntity.getComponent("onPowerLossSprite") as OnPowerLossSpriteComponent;
                    gameEntity.addComponent(new SpriteComponent(onPowerLossSpriteComponent.sprite));
                });

            }

        })
    }


    onEnter(): void {
        AudioManager.play("wind");
        this.createTranslationMap();
        this.createGameMap();
        this._walkSound = "dirtStep";


        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");

        if (this._firstEnter) {
            this._camera = new Camera(67, 62, -0.66, 0.6, 0.66);
            this._firstEnter = false;
        } else {
            this._camera = new Camera(66.39, 64.99, 0.696, -0.889, 0.66);
        }

        player.addComponent(new CameraComponent(this._camera));
        this.createInventory();
    }

    onExit(): void {
        AudioManager.stop("wind");
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

        if (this._alphaFade > 0.1) {

            this._fadeTick++;

            if (this._fadeTick == this._fadeRate) {
                this._fadeTick = 0;
                this._alphaFade -= 0.09;
            }

            Renderer.print("The Outpost", 100, 250, {
                family: Fonts.OxaniumBold,
                size: 100,
                color: new Color(255, 255, 255, this._alphaFade)
            })
        }

        // Renderer.print("30 Days Until Storm ", 100, 250, {family: Fonts.OxaniumBold, size: 100, color: Colors.WHITE()})


        this.wideScreen();

        // this.debug();
    }


}
