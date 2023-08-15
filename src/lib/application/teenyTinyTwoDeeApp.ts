import {GameEventBus} from "../gameEvent/gameEventBus";
import {GameEvent} from "../gameEvent/gameEvent";
import {AudioManager} from "../audio/audioManager";
import {Renderer} from "../rendering/renderer";
import {LocalStorage} from "../localStorage/localStorage";
import {ConfigurationManager} from "./configuration";
import {logger, LogType} from "../utils/loggerUtils";
import {GameScreen} from "./gameScreen";
import {Mouse, MouseButton} from "../input/mouse";
import {ScreenChangeEvent} from "../gameEvent/screenChangeEvent";
import {GlobalState} from "@lib/application/globalState";
import {GlobalLogic} from "@lib/application/globalLogic";

const cfg = require("../../cfg/configuration.json");

const framesPerSecond: number = 120;

export class TeenyTinyTwoDeeApp {

    private _gameScreens: Map<string, GameScreen>;
    private _currentScreen: string;


    constructor() {

        ConfigurationManager.init(cfg);
        logger(LogType.INFO, "TeenyTinyTwoDeeApp V: 0.0.1");

        document.addEventListener('keydown', (event: KeyboardEvent) => {

            event.preventDefault();

            GameEventBus.publish(
                new GameEvent("keyboardDownEvent", event)
            );
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {

            event.preventDefault();

            GameEventBus.publish(
                new GameEvent("keyboardUpEvent", event)
            );
        });

        document.addEventListener('mousedown', (event: MouseEvent) => {

            GameEventBus.publish(
                new GameEvent("mouseDownEvent", event)
            );
        });

        document.addEventListener('mousemove', (event) => {
            GameEventBus.publish(
                new GameEvent("mouseMoveEvent", event)
            );
        });

        GameEventBus.register("keyboardDownEvent", (gameEvent: GameEvent) => {


            GlobalState.createState(`KEY_${gameEvent.payload.keyCode}`, true);


            this._gameScreens.get(this._currentScreen).keyboard(gameEvent.payload.keyCode);
        });

        GameEventBus.register("keyboardUpEvent", (gameEvent: GameEvent) => {

            GlobalState.createState(`KEY_${gameEvent.payload.keyCode}`, false);


            this._gameScreens.get(this._currentScreen).keyboard(gameEvent.payload.keyCode);
        });

        GameEventBus.register("mouseMoveEvent", (gameEvent: GameEvent) => {

            Mouse.x = gameEvent.payload.x;
            Mouse.y = gameEvent.payload.y;

            this._gameScreens.get(this._currentScreen).mouseMove(gameEvent.payload.x, gameEvent.payload.y);
        });

        GameEventBus.register("mouseDownEvent", (gameEvent: GameEvent) => {

            let mouseButton: MouseButton;

            Mouse.x = gameEvent.payload.x;
            Mouse.y = gameEvent.payload.y;

            if (gameEvent.payload.button == 0) {
                mouseButton = MouseButton.LEFT;

            } else if (gameEvent.payload.button == 2) {
                mouseButton = MouseButton.RIGHT;
            } else if (gameEvent.payload.button == 3) {
                mouseButton = MouseButton.MIDDLE;
            } else {
                mouseButton = null;
            }

            Mouse.button = mouseButton;
            Mouse.x = gameEvent.payload.x;
            Mouse.y = gameEvent.payload.y;

            this._gameScreens.get(this._currentScreen).mouseClick(gameEvent.payload.x, gameEvent.payload.y, mouseButton);
        });
    }

    run(gameScreens: Map<string, GameScreen>, currentScreen: string): void {
        LocalStorage.init();
        Renderer.init();
        AudioManager.init();

        this._gameScreens = gameScreens;

        this._gameScreens.forEach((gameScreens) => {
            gameScreens.init();
        });

        GameEventBus.register("__CHANGE_SCREEN__", (gameEvent: GameEvent) => {
            logger(LogType.INFO, gameEvent.payload);

            if (this._currentScreen != null) {
                this._gameScreens.get(this._currentScreen).onExit();
            }

            this._currentScreen = gameEvent.payload;
            this._gameScreens.get(this._currentScreen).onEnter();
        });

        GameEventBus.publish(new ScreenChangeEvent(currentScreen))

        this.gameLoop();
    }


    gameLoop() {

        GlobalLogic.execute();
        this._gameScreens.get(this._currentScreen).logicLoop();

        Renderer.clearScreen();

        this._gameScreens.get(this._currentScreen).renderLoop();

        setTimeout(() => {
            requestAnimationFrame(this.gameLoop.bind(this));
        }, 1000 / framesPerSecond);
    }


    resize() {
        Renderer.resize();
    }

}

