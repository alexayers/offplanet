import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {OxygenComponent} from "../components/oxygenComponent";
import {Renderer} from "@lib/rendering/renderer";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {GameEntity} from "@lib/ecs/gameEntity";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {World} from "@lib/rendering/rayCaster/world";
import {Colors} from "@lib/utils/colorUtils";
import {CanHaveMessage} from "../components/canHaveMessage";
import {Sprite} from "@lib/rendering/sprite";
import {HealthComponent} from "../components/healthComponent";
import {SuitComponent} from "../components/suitComponent";
import {StaminaComponent} from "../components/staminaComponent";
import {HungerComponent} from "../components/hungerComponent";
import {calculatePercent, calculateXPercentOfY} from "@lib/utils/mathUtils";


export class HelmetRenderSystem implements GameRenderSystem {

    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();
    private _visorLine: number = 0;
    private _world: World = World.getInstance();
    private _ore: Sprite = new Sprite(0,0, require("../../assets/images/rock.png"));

    process(): void {

        let player: GameEntity = this._gameEntityRegistry.getSingleton("player");

        if (player.hasComponent("dead")) {
            return;
        }

        let camera: CameraComponent = player.getComponent("camera") as CameraComponent;

        this.renderDamaged(camera);
        this.renderMessage(camera)

        let health: HealthComponent = player.getComponent("health") as HealthComponent;
        let suit: SuitComponent = player.getComponent("suit") as SuitComponent;
        let stamina: StaminaComponent = player.getComponent("stamina") as StaminaComponent;
        let hunger: HungerComponent = player.getComponent("hunger") as HungerComponent;


        let offsetY : number = 100;

        Renderer.print(`Health:`, 10, Renderer.getCanvasHeight() - offsetY, {
            family: Fonts.Oxanium,
            size: 16,
            color: new Color(255, 255, 255, 0.45)
        });

        Renderer.rect(90, Renderer.getCanvasHeight() - offsetY - 13, 100,15, Colors.BLACK());

        let healthPercent : number = calculateXPercentOfY(health.current, health.max);
        let healthBar : number = calculatePercent(healthPercent, 100);

        Renderer.rect(90, Renderer.getCanvasHeight() - offsetY - 13, healthBar,15, new Color(168, 50, 62, 0.95))

        offsetY -= 30;

        Renderer.print(`Suit:`, 10, Renderer.getCanvasHeight() - offsetY, {
            family: Fonts.Oxanium,
            size: 16,
            color: new Color(255, 255, 255, 0.45)
        });

        Renderer.rect(90, Renderer.getCanvasHeight() - offsetY - 13, 100,15, Colors.BLACK())

        let suitPercent : number = calculateXPercentOfY(suit.current, suit.max);
        let suitBar : number = calculatePercent(suitPercent, 100);


        Renderer.rect(90, Renderer.getCanvasHeight() - offsetY - 13, suitBar,15, new Color(50, 115, 168, 0.95))

        ///

        offsetY  = 100;

        Renderer.print(`Hunger:`, 210, Renderer.getCanvasHeight() - offsetY, {
            family: Fonts.Oxanium,
            size: 16,
            color: new Color(255, 255, 255, 0.45)
        });

        Renderer.rect(290, Renderer.getCanvasHeight() - offsetY - 13, 100,15, Colors.BLACK())


        let hungerPercent : number = calculateXPercentOfY(hunger.current, hunger.max);
        let hungerBar : number = calculatePercent(hungerPercent, 100);

        Renderer.rect(290, Renderer.getCanvasHeight() - offsetY - 13, hungerBar,15, new Color(113, 168, 50, 0.95))

        offsetY -= 30;

        Renderer.print(`Stamina:`, 210, Renderer.getCanvasHeight() - offsetY, {
            family: Fonts.Oxanium,
            size: 16,
            color: new Color(255, 255, 255, 0.45)
        });

        Renderer.rect(290, Renderer.getCanvasHeight() - offsetY - 13, 100,15, Colors.BLACK())

        let staminaPercent : number = calculateXPercentOfY(stamina.current, stamina.max);
        let staminaBar : number = calculatePercent(staminaPercent, 100);

        Renderer.rect(290, Renderer.getCanvasHeight() - offsetY - 13, staminaBar,15, new Color(162, 50, 168, 0.95))





        this.renderHelmetEffect();

    }

    renderHelmetEffect(): void {
        let lineColor: Color = new Color(255, 20, 255, 0.0323);

        for (let y: number = 0; y < Renderer.getCanvasHeight(); y += 64) {
            Renderer.line(0, y, Renderer.getCanvasWidth(), y, 1, lineColor);
        }

        for (let x: number = 0; x < Renderer.getCanvasWidth(); x += 64) {
            Renderer.line(x, 0, x, Renderer.getCanvasHeight(), 1, lineColor);
        }

        Renderer.rect(0, this._visorLine, Renderer.getCanvasWidth(), 64, lineColor);
        this._visorLine += 5;

        if (this._visorLine > Renderer.getCanvasHeight()) {
            this._visorLine = -100;
        }
    }

    renderDamaged(camera: CameraComponent): void {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("damaged")) {

            Renderer.rect((Renderer.getCanvasWidth() / 2) - 10, (Renderer.getCanvasHeight() / 2) - 20, 105, 40, Colors.BLACK())

            Renderer.print("Damaged", Renderer.getCanvasWidth() / 2, Renderer.getCanvasHeight() / 2, {
                family: Fonts.Oxanium,
                size: 20,
                color: Colors.WHITE()
            });
        }
    }

    renderMessage(camera: CameraComponent): void {

        let checkMapX: number = Math.floor(camera.xPos + camera.xDir);
        let checkMapY: number = Math.floor(camera.yPos + camera.yDir);

        let gameEntity: GameEntity = this._world.getPosition(checkMapX, checkMapY);

        if (gameEntity.hasComponent("canHaveMessage")) {
            let canHaveMessage: CanHaveMessage = gameEntity.getComponent("canHaveMessage") as CanHaveMessage;

            canHaveMessage.callBack();
        }
    }
}
