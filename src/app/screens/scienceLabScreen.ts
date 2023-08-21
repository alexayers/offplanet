import {GameScreen} from "@lib/application/gameScreen";
import {GameScreenBase} from "./gameScreenBase";
import {GameEntity} from "@lib/ecs/gameEntity";
import {GameEntityBuilder} from "@lib/ecs/gameEntityBuilder";
import {FloorComponent} from "@lib/ecs/components/floorComponent";
import {WallComponent} from "@lib/ecs/components/wallComponent";
import {SpriteComponent} from "@lib/ecs/components/spriteComponent";
import {Sprite} from "@lib/rendering/sprite";
import {World, WorldMap} from "@lib/rendering/rayCaster/world";
import {Colors} from "@lib/utils/colorUtils";
import {Color} from "@lib/primatives/color";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {OxygenComponent} from "../components/oxygenComponent";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {VelocityComponent} from "@lib/ecs/components/velocityComponent";
import {RayCastRenderSystem} from "@lib/ecs/system/render/rayCastRenderSystem";
import {HelmetRenderSystem} from "../system/helmetRenderSystem";
import {GlobalState} from "@lib/application/globalState";
import {OnPowerAnimatedSpriteComponent} from "../components/onPowerAnimatedSpriteComponent";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {OnPowerLossSpriteComponent} from "../components/onPowerLossSpriteComponent";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {Renderer} from "@lib/rendering/renderer";
import {logger, LogType} from "@lib/utils/loggerUtils";
import {Fonts} from "../fonts";
import {AnimatedSprite} from "@lib/rendering/animatedSprite";
import {CanDamageComponent} from "@lib/ecs/components/canDamageComponent";
import {BuildingRenderSystem} from "../system/buildingRenderSystem";
import {TransparentComponent} from "@lib/ecs/components/transparentComponent";
import {DoorComponent} from "@lib/ecs/components/doorComponent";
import {DustRenderSystem} from "../system/dustRenderSystem";
import {AirLockParticleRender} from "../system/airLockParticleRender";
import {CanInteractComponent} from "@lib/ecs/components/canInteractComponent";
import {GameEventBus} from "@lib/gameEvent/gameEventBus";
import {ScreenChangeEvent} from "@lib/gameEvent/screenChangeEvent";
import {Screens} from "./screens";
import {AudioManager} from "@lib/audio/audioManager";


export class ScienceLabScreen extends GameScreenBase implements GameScreen {

    private _mapBuilder: Map<string, Array<GameEntity>> = new Map<string, Array<GameEntity>>();

    private _alphaFade: number = 1;
    private _fadeTick: number = 0;
    private _fadeRate: number = 16;


    constructor() {
        super();
    }

    init(): void {

        this.createPlayer();
        AudioManager.register("stepMetal", require("../../assets/sound/stepMetal.wav"));
        AudioManager.register("airBlast", require("../../assets/sound/airBlast.wav"));
        AudioManager.register("slidingDoor", require("../../assets/sound/slidingDoor.wav"));
        AudioManager.register("stationHum", require("../../assets/sound/stationHum.wav"), true);

        this.registerRenderSystems([
            new RayCastRenderSystem(),
            new DustRenderSystem(),
            new AirLockParticleRender()
        ]);

        this.registerPostRenderSystems([
            new HelmetRenderSystem(),
            new BuildingRenderSystem()
        ]);


        logger(LogType.INFO, "ScienceLab Initialized");
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

    createPlayer(): void {
        this._camera = new Camera(6.5, 1.8, 0, 1, 0.66);

        this._player = new GameEntityBuilder("player")
            .addComponent(this.createInventory())
            .addComponent(new OxygenComponent(50, 100))
            .addComponent(new CameraComponent(this._camera))
            .addComponent(new VelocityComponent(0, 0))
            .build();

        //    this._gameEntityRegistry.registerSingleton(this._player);
    }


    createGameMap(): void {
        let grid: Array<number> = [];

        let width: number = 20;
        let height: number = 20;


        grid = [1, 1, 1, 1, 1, 1, 21, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 16, 16, 16, 4, 0, 4, 11, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 1, 16, 0, 0, 13, 4, 0, 4, 12, 0, 0, 3, 0, 15, 15, 15, 15, 15, 15, 1, 1, 16, 0, 16, 16, 4, 0, 4, 11, 0, 0, 2, 15, 2, 8, 8, 8, 8, 8, 1, 1, 2, 3, 2, 6, 4, 22, 4, 2, 2, 3, 2, 2, 2, 8, 0, 0, 0, 8, 1, 1, 0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 8, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 8, 1, 1, 14, 2, 3, 2, 14, 6, 2, 0, 2, 6, 2, 0, 0, 8, 8, 20, 8, 8, 1, 1, 10, 10, 0, 10, 10, 2, 2, 3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 10, 0, 0, 0, 10, 2, 0, 0, 2, 2, 2, 2, 6, 2, 2, 3, 2, 2, 1, 1, 10, 0, 0, 0, 10, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 10, 10, 10, 10, 10, 2, 0, 0, 0, 0, 2, 2, 6, 14, 2, 2, 6, 2, 1, 1, 17, 18, 17, 2, 2, 2, 2, 2, 2, 0, 2, 7, 7, 7, 7, 7, 7, 2, 1, 1, 0, 0, 17, 9, 9, 9, 9, 9, 2, 0, 2, 7, 0, 0, 0, 0, 7, 2, 1, 1, 17, 19, 17, 9, 0, 0, 0, 9, 2, 19, 2, 7, 7, 7, 0, 7, 7, 2, 1, 1, 0, 0, 17, 9, 0, 0, 0, 9, 17, 0, 17, 17, 18, 17, 19, 17, 17, 17, 1, 1, 0, 0, 18, 9, 9, 0, 9, 9, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 17, 17, 17, 19, 17, 17, 17, 18, 17, 17, 14, 17, 19, 17, 14, 17, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

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

    createTranslationMap(): void {
        let floor: GameEntity = new GameEntityBuilder("floor")
            .addComponent(new FloorComponent())
            .build();

        this.addEntity(0, floor);

        let wall: GameEntity = new GameEntityBuilder("wall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/spaceStationWall.png"))))
            .build();

        this.addEntity(1, wall);

        let innerLabWall: GameEntity = new GameEntityBuilder("innerLabWall")
            .addComponent(new WallComponent())

            .addComponent(new CanDamageComponent(new Sprite(0, 0, require("../../assets/images/damageRock.png"))))
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/innerLabWall.png"))))
            .build();

        this.addEntity(2, innerLabWall);

        let labDoor: GameEntity = new GameEntityBuilder("labDoor")
            .addComponent(new DoorComponent())
            .addComponent(new CanInteractComponent(() => {
                AudioManager.play("slidingDoor");
            }))
            .addComponent(new SpriteComponent(new Sprite(0, 0, require("../../assets/images/labDoor.png"))))
            .build();

        this.addEntity(3, labDoor);


        let airLock: GameEntity = new GameEntityBuilder("airLock")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airLock.png"))))
            .build();

        this.addEntity(4, airLock);

        let airLockWarning: GameEntity = new GameEntityBuilder("airLockWarning")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airLockWarning.png"))))
            .build();

        this.addEntity(5, airLockWarning);

        let airFilter: GameEntity = new GameEntityBuilder("airFilter")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/airFilter.png"))))
            .build();

        this.addEntity(6, airFilter);

        let workShopWall: GameEntity = new GameEntityBuilder("workShopWall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/workShopWall.png"))))
            .build();

        this.addEntity(7, workShopWall);

        let freezerWall: GameEntity = new GameEntityBuilder("freezerWall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/freezerWall.png"))))
            .build();

        this.addEntity(8, freezerWall);

        let generatorWall: GameEntity = new GameEntityBuilder("generatorWall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/generatorWall.png"))))
            .build();

        this.addEntity(9, generatorWall);

        let dataCenterWall: GameEntity = new GameEntityBuilder("dataCenterWall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/dataCenterWall.png"))))
            .build();

        this.addEntity(10, dataCenterWall);

        let kitchenCabinet: GameEntity = new GameEntityBuilder("kitchenCabinet")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/kitchenCabinet.png"))))
            .build();

        this.addEntity(11, kitchenCabinet);

        let kitchenOven: GameEntity = new GameEntityBuilder("kitchenOven")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/kitchenOven.png"))))
            .build();

        this.addEntity(12, kitchenOven);

        let bed: GameEntity = new GameEntityBuilder("bed")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/bed.png"))))
            .build();

        this.addEntity(13, bed);

        let glass: GameEntity = new GameEntityBuilder("glass")
            .addComponent(new WallComponent())
            .addComponent(new TransparentComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/glass.png"))))
            .build();

        this.addEntity(14, glass);

        let plants: GameEntity = new GameEntityBuilder("plants")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/plants.png"))))
            .build();

        this.addEntity(15, plants);

        let bedRoom: GameEntity = new GameEntityBuilder("bedRoom")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/bedRoom.png"))))
            .build();

        this.addEntity(16, bedRoom);

        let backRoom: GameEntity = new GameEntityBuilder("backRoom")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/backRoom.png"))))
            .build();

        this.addEntity(17, backRoom);

        let backRoomFilter: GameEntity = new GameEntityBuilder("backRoomFilter")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/backRoomFilter.png"))))
            .build();

        this.addEntity(18, backRoomFilter);

        let backRoomDoor: GameEntity = new GameEntityBuilder("backRoomDoor")
            .addComponent(new WallComponent())
            .addComponent(new DoorComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/backRoomDoor.png"))))
            .build();

        this.addEntity(19, backRoomDoor);

        let freezerDoor: GameEntity = new GameEntityBuilder("freezerDoor")
            .addComponent(new WallComponent())
            .addComponent(new DoorComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/freezerDoor.png"))))
            .build();

        this.addEntity(20, freezerDoor);

        let airLockDoorInterior: GameEntity = new GameEntityBuilder("airLockDoorInterior")
            .addComponent(new WallComponent())
            .addComponent(new CanInteractComponent(() => {
                GameEventBus.publish(new ScreenChangeEvent(Screens.PLANET_SURFACE))
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


        this.addEntity(21, airLockDoorInterior);

        let innerAirLock: GameEntity = new GameEntityBuilder("innerAirLock")
            .addComponent(new WallComponent())
            .addComponent(new DoorComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/innerAirLock.png"))))
            .build();

        this.addEntity(22, innerAirLock);
    }

    onEnter(): void {
        this.createTranslationMap();
        this.createGameMap();

        this._walkSound = "stepMetal";
        AudioManager.play("airBlast");
        AudioManager.play("stationHum");
        logger(LogType.INFO, "Entered Science Lab Screen");

        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");
        this._camera = new Camera(6.5, 1.8, 0, 1, 0.66);
        player.addComponent(new CameraComponent(this._camera));

    }


    onExit(): void {
        AudioManager.play("airBlast");
        AudioManager.stop("stationHum");

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

        this.title();

        this.wideScreen();

        //  this.debug();
    }

    title(): void {
        if (this._alphaFade > 0.1) {

            this._fadeTick++;

            if (this._fadeTick == this._fadeRate) {
                this._fadeTick = 0;
                this._alphaFade -= 0.19;
            }

            Renderer.print("Delta Lab", 50, 250, {
                family: Fonts.OxaniumBold,
                size: 100,
                color: new Color(0, 0, 0, this._alphaFade)
            })
        }
    }

}
