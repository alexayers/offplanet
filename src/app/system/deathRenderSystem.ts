import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {GameEntity} from "@lib/ecs/gameEntity";
import {Renderer} from "@lib/rendering/renderer";
import {CameraComponent} from "@lib/ecs/components/cameraComponent";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {GameEventBus} from "@lib/gameEvent/gameEventBus";
import {ScreenChangeEvent} from "@lib/gameEvent/screenChangeEvent";
import {Screens} from "../screens/screens";


export class DeathRenderSystem implements GameRenderSystem {

    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();
    private _alphaFade : number = 1;
    private _fadeTick:number = 0;
    private _fadeRate : number = 16;

    process(): void {

        let player : GameEntity = this._gameEntityRegistry.getSingleton("player");


        if (player.hasComponent("dead")) {

            let camera: CameraComponent = player.getComponent("camera") as CameraComponent;

            let context : CanvasRenderingContext2D = Renderer.getContext();
            let imageData = context.getImageData(0,0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight());
            let data = imageData.data;


            for (let i : number = 0; i < data.length; i += 4) {
                // get the medium of the 3 first values ( (r+g+b)/3 )
                let med = (data[i] +data[i + 1] + data[i + 2]) / 3;
                // set it to each value (r = g = b = med)
                data[i] = data[i + 1] = data[i + 2] = med;
                // we don't touch the alpha
             //   data[i + 4] = this._alphaFade;

            }
            // redraw the new computed image
            context.putImageData(imageData, 0, 0);

            this._alphaFade += 0.001;

            if (this._alphaFade > 0.1) {

                this._fadeTick++;

                if (this._fadeTick == this._fadeRate) {
                    this._fadeTick = 0;
                    this._alphaFade -= 0.09;
                  //  GameEventBus.publish(new ScreenChangeEvent(Screens.MAIN_MENU));
                }

                Renderer.print("You have died", 60, 250, {family: Fonts.OxaniumBold, size: 100, color: new Color(255,255,255, this._alphaFade)})
            }

        }

    }

}
