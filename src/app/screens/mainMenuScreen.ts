import {GameScreen} from "@lib/application/gameScreen";
import {MouseButton} from "@lib/input/mouse";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {KeyboardInput} from "@lib/input/keyboard";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {Timer} from "@lib/utils/timerUtils";
import {getRandomBetween} from "@lib/utils/mathUtils";


export class MainMenuScreen implements GameScreen {

    private _currentMenuIdx: number = 0;
    private _menuItems: Array<string> = [];
    private _timer : Timer = new Timer();

    init(): void {

        this._menuItems.push("Begin");
        this._menuItems.push("Quit");
        this._timer.start(100);
    }

    keyboard(keyCode: number): void {

        if (!this._timer.isTimePassed()) {
            return;
        }


        this._timer.reset();

        switch (keyCode) {
            case KeyboardInput.UP:
                this._currentMenuIdx--;

                if (this._currentMenuIdx < 0) {
                    this._currentMenuIdx = this._menuItems.length - 1;
                }

                break;
            case KeyboardInput.DOWN:
                this._currentMenuIdx++;

                if (this._currentMenuIdx == this._menuItems.length) {
                    this._currentMenuIdx = 0;
                }

                break;
        }
    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    onEnter(): void {
    }

    onExit(): void {
    }

    renderLoop(): void {

        Renderer.rect(0,0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight(), Colors.BLACK());



        Renderer.circle(100,100, 400, new Color(138, 34, 14))
        Renderer.circle(105,100, 410, new Color(138, 34, 14, 0.123 + getRandomBetween(1,5) / 100))

        Renderer.print("Off Planet", 10, 200, {family: Fonts.Oxanium, size: 90, color: Colors.WHITE()})


        let offsetY : number = 150;

        for (let i : number = 0; i < this._menuItems.length; i++) {

            if (i == this._currentMenuIdx) {
                Renderer.print(this._menuItems[i], Renderer.getCanvasWidth() - 200, Renderer.getCanvasHeight() - offsetY, {family: Fonts.Oxanium, size: 35, color: new Color(138, 34, 14)});

            } else {
                Renderer.print(this._menuItems[i], Renderer.getCanvasWidth() - 200, Renderer.getCanvasHeight() - offsetY, {family: Fonts.Oxanium, size: 35, color: Colors.WHITE()});

            }

            offsetY -= 50;
        }

    }

}
