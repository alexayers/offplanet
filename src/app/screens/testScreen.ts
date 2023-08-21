import {GameScreen} from "@lib/application/gameScreen";
import {GameScreenBase} from "./gameScreenBase";
import {RayCastRenderSystem} from "@lib/ecs/system/render/rayCastRenderSystem";
import {HelmetRenderSystem} from "../system/helmetRenderSystem";
import {logger, LogType} from "@lib/utils/loggerUtils";
import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {GameEntity} from "@lib/ecs/gameEntity";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {Color} from "@lib/primatives/color";
import {Camera} from "@lib/rendering/rayCaster/camera";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {GameEntityBuilder} from "@lib/ecs/gameEntityBuilder";
import {FloorComponent} from "@lib/ecs/components/floorComponent";
import {WallComponent} from "@lib/ecs/components/wallComponent";
import {SpriteComponent} from "@lib/ecs/components/spriteComponent";
import {Sprite} from "@lib/rendering/sprite";
import {World, WorldMap} from "@lib/rendering/rayCaster/world";
import {Colors} from "@lib/utils/colorUtils";

export class TestScreen extends GameScreenBase implements GameScreen {

    constructor() {
        super();
    }

    init(): void {

        this.registerRenderSystems([
            new RayCastRenderSystem(),
            new HelmetRenderSystem()

        ]);

        logger(LogType.INFO, "TestScreen Initialized");
    }

    createTranslationMap(): void {
        let floor: GameEntity = new GameEntityBuilder("floor")
            .addComponent(new FloorComponent())
            .build();

        this.addEntity(0, floor);

        let wall: GameEntity = new GameEntityBuilder("wall")
            .addComponent(new WallComponent())
            .addComponent(new SpriteComponent(new Sprite(128, 128, require("../../assets/images/testTile.png"))))
            .build();

        this.addEntity(1, wall);
    }

    createGameMap(): void {

        let width: number = 10;
        let height: number = 10;
        let grid: Array<number> = [];

        for (let y: number = 0; y < height; y++) {
            for (let x: number = 0; x < width; x++) {
                if (y == 0 || y == height - 1 || x == 0 || x == width - 1) {
                    grid.push(1);
                } else {
                    grid.push(0);
                }
            }
        }

        let world: World = World.getInstance();


        let worldMap: WorldMap = {
            grid: grid,
            skyColor: Colors.BLACK(),
            floorColor: new Color(190, 190, 190),
            translationTable: this._translationTable,
            width: width,
            height: height,
            lightRange: 18
        }

        world.loadMap(worldMap);
    }


    onEnter(): void {
        this.createTranslationMap();
        this.createGameMap();
        this._walkSound = "dirtStep";


        this._player = this._gameEntityRegistry.getSingleton("player");
        this._camera = new Camera(2, 2, 0, 1, 0.66);


        this._player.addComponent(new CameraComponent(this._camera));
        this.createInventory();
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

        this.debug();
    }

}
