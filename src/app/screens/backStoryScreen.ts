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
    private _startFadeOut: boolean = false;
    private _alphaFade: number = 0;

    private _visorLine: number = 0;

    private _tick: number = 0;
    private _tickRate: number = 6;

    init(): void {
        AudioManager.register("message", require("../../assets/sound/message.wav"));
    }

    keyboard(): void {
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

        let line: string = "You are stranded on a small research outpost in the Vega Nexus system.";
        line += " With limited resources and intense planetary storms your chance for rescue is slim.";
        line += " But not impossible...";
        let printLine: string = line.substring(0, this._characterPosition1);

        this._tick++;

        if (this._tick == this._tickRate && this._characterPosition1 < line.length) {
            this._tick = 0;
            this._characterPosition1++;
        }

        if (this._characterPosition1 >= line.length) {
            this._startFadeOut = true;
        }

        let lines: Array<string> = Renderer.getLines(printLine, 600);

        for (let i: number = 0; i < lines.length; i++) {

            Renderer.print(lines[i], 80, offsetY, {family: Fonts.Oxanium, size: 16, color: Colors.WHITE()})
            offsetY += 30;

        }

        this.renderHelmetEffect();

        if (this._startFadeOut) {


            this._alphaFade += 0.01;
            Renderer.rect(0, 0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight(), new Color(112, 36, 21, this._alphaFade));

            if (this._alphaFade >= 1) {
                GameEventBus.publish(new ScreenChangeEvent(Screens.PLANET_SURFACE));
            }
        }


    }

    renderHelmetEffect(): void {
        let lineColor: Color = new Color(200, 240, 90, 0.223);

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
}
