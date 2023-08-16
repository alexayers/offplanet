import {GameScreen} from "@lib/application/gameScreen";
import {MouseButton} from "@lib/input/mouse";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {GameEventBus} from "@lib/gameEvent/gameEventBus";
import {ScreenChangeEvent} from "@lib/gameEvent/screenChangeEvent";
import {Screens} from "./screens";
import {AudioManager} from "@lib/audio/audioManager";

export class BackStoryScreen implements GameScreen {

    private _characterPosition1: number = 0;
    private _characterPosition2: number = 0;
    private _characterPosition3: number = 0;
    private _startFadeOut: boolean = false;
    private _alphaFade: number = 0;

    private _tick: number = 0;
    private _tickRate: number = 6;

    init(): void {
        AudioManager.register("message", require("../../assets/sound/message.wav"));
    }

    keyboard(keyCode: number): void {
    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    onEnter(): void {
        AudioManager.play("message");
    }

    onExit(): void {
    }

    renderLoop(): void {
        Renderer.rect(0, 0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight(), Colors.BLACK());

        let offsetY: number = 150;

        let line1: string = "You are stranded on a small research outpost in the Vega Nexus system.";
        let line2: string = "With limited resources and intense planetary storms your chance for rescue is slim.";
        let line3: string = "But not impossible...";

        let printLine1: string = line1.substring(0, this._characterPosition1);
        Renderer.print(printLine1, 80, offsetY, {family: Fonts.Oxanium, size: 16, color: Colors.WHITE()})
        offsetY += 30;

        let printLine2: string = line2.substring(0, this._characterPosition2);

        Renderer.print(printLine2, 80, offsetY, {family: Fonts.Oxanium, size: 16, color: Colors.WHITE()})
        offsetY += 30;


        let printLine3: string = line3.substring(0, this._characterPosition3);

        Renderer.print(printLine3, 80, offsetY, {family: Fonts.Oxanium, size: 16, color: Colors.WHITE()})

        this._tick++;

        if (this._tick == this._tickRate) {
            this._tick = 0;
            this._characterPosition1++;

            if (this._characterPosition1 > line1.length) {
                this._characterPosition1 = line1.length;

                this._characterPosition2++;

                if (this._characterPosition2 > line2.length) {
                    this._characterPosition2 = line2.length;

                    this._characterPosition3++;

                    if (this._characterPosition3 > line3.length) {
                        this._characterPosition3 = line3.length;
                        this._startFadeOut = true;
                    }

                }
            }

        }


        if (this._startFadeOut) {


            this._alphaFade += 0.01;
            Renderer.rect(0, 0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight(), new Color(112, 36, 21, this._alphaFade));

            if (this._alphaFade >= 1) {
                GameEventBus.publish(new ScreenChangeEvent(Screens.PLANET_SURFACE));
            }
        }


    }

}
