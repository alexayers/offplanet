import {GameScreen} from "@lib/application/gameScreen";
import {MouseButton} from "@lib/input/mouse";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {isKeyDown, KeyboardInput} from "@lib/input/keyboard";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {Timer} from "@lib/utils/timerUtils";
import {getRandomBetween} from "@lib/utils/mathUtils";
import {GameEventBus} from "@lib/gameEvent/gameEventBus";
import {ScreenChangeEvent} from "@lib/gameEvent/screenChangeEvent";
import {Screens} from "./screens";
import {AudioManager} from "@lib/audio/audioManager";


export class MainMenuScreen implements GameScreen {

    private _currentMenuIdx: number = 0;
    private _menuItems: Array<string> = [];
    private _timer: Timer = new Timer();
    private _satX: number = 0;
    private _blinkTimer = new Timer(1000);

    init(): void {

        AudioManager.register("theme", require("../../assets/sound/theme.wav"));
        AudioManager.register("boop", require("../../assets/sound/boop.wav"));


        this._menuItems.push("Begin");
        this._menuItems.push("Quit");
        this._timer.start(100);
    }

    keyboard(): void {

        if (!this._timer.isTimePassed()) {
            return;
        }


        this._timer.reset();


        if (isKeyDown(KeyboardInput.UP)) {
            this._currentMenuIdx--;

            if (this._currentMenuIdx < 0) {
                this._currentMenuIdx = this._menuItems.length - 1;
            }

            AudioManager.play("boop");
        }

        if (isKeyDown(KeyboardInput.DOWN)) {
            this._currentMenuIdx++;

            if (this._currentMenuIdx == this._menuItems.length) {
                this._currentMenuIdx = 0;
            }

            AudioManager.play("boop");

        }
        if (isKeyDown(KeyboardInput.ENTER)) {

            if (this._currentMenuIdx == 0) {
                GameEventBus.publish(new ScreenChangeEvent(Screens.BACK_STORY))
            }

        }

    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }


    mouseMove(x: number, y: number): void {
    }

    onEnter(): void {
        AudioManager.play("theme");
    }

    onExit(): void {
        AudioManager.stop("theme")
    }


    renderLoop(): void {

        Renderer.rect(0, 0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight(), Colors.BLACK());


        Renderer.circle(450, 300, 100, new Color(14, 34, 2))

        Renderer.circle(600 - (this._satX / 10), 100, 5, new Color(255, 255, 255))
        Renderer.circle(600 - (this._satX / 10), 100, 10, new Color(32, 116, 189, 0.245))


        Renderer.circle(100, 100, 400, new Color(138, 34, 14))
        Renderer.circle(105, 100, 410, new Color(138, 34, 14, 0.123 + getRandomBetween(1, 5) / 100))


        Renderer.print("Alex Ayers Presents:", 10, 115, {family: Fonts.OxaniumBold, size: 20, color: Colors.WHITE()})
        Renderer.print("The Outpost", 10, 200, {family: Fonts.OxaniumBold, size: 90, color: Colors.WHITE()})


        let offsetY: number = 150;

        for (let i: number = 0; i < this._menuItems.length; i++) {

            if (i == this._currentMenuIdx) {

                Renderer.print(this._menuItems[i], Renderer.getCanvasWidth() - 200, Renderer.getCanvasHeight() - offsetY, {
                    family: Fonts.Oxanium,
                    size: 35,
                    color: Colors.WHITE()
                });
            } else {
                Renderer.print(this._menuItems[i], Renderer.getCanvasWidth() - 200, Renderer.getCanvasHeight() - offsetY, {
                    family: Fonts.Oxanium,
                    size: 35,
                    color: new Color(138, 34, 14)
                });
            }

            offsetY -= 50;
        }

        for (let i = 0; i < Renderer.getCanvasHeight(); i += 4) {
            Renderer.line(0, i, Renderer.getCanvasWidth(), i, 2, new Color(0, 0, 0, 0.14))
        }

        Renderer.rect(this._satX, 300, 4, 4, Colors.WHITE())

        if (this._blinkTimer.isTimePassed()) {
            Renderer.rect(this._satX - 2, 298, 8, 8, new Color(255, 255, 255, 0.54));
            this._blinkTimer.reset();
        }

        this._satX += 0.25;

        if (this._satX > Renderer.getCanvasWidth()) {
            this._satX = -100;
        }

    }

}
