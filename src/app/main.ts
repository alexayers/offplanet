import {TeenyTinyTwoDeeApp} from "@lib/application/teenyTinyTwoDeeApp";
import {GameScreen} from "@lib/application/gameScreen";
import './index.css';
import {GlobalState} from "@lib/application/globalState";
import {LocalStorageDB} from "@lib/localStorage/localStorageDB";
import {Screens} from "./screens/screens";
import {PlanetSurface} from "./screens/planetSurface";
import {MainMenuScreen} from "./screens/mainMenuScreen";
import {BackStoryScreen} from "./screens/backStoryScreen";
import {ScienceLabScreen} from "./screens/scienceLabScreen";

export class Game extends TeenyTinyTwoDeeApp {

    private _localStorageDB: LocalStorageDB = LocalStorageDB.getInstance();

    init() {

        this._localStorageDB.connect("OffPlanet");

        GlobalState.createState("time", {
            currentTick: 0,
            hour: 9,
            minute: 0,
            ticksPerMinute: 240
        })


        const gameScreens: Map<string, GameScreen> = new Map<string, GameScreen>();

        gameScreens.set(Screens.MAIN_MENU, new MainMenuScreen());
        gameScreens.set(Screens.BACK_STORY, new BackStoryScreen());
        gameScreens.set(Screens.PLANET_SURFACE, new PlanetSurface());
        gameScreens.set(Screens.SCIENCE_LAB, new ScienceLabScreen())

        this.run(gameScreens, Screens.SCIENCE_LAB);

    }


    setupDatabase(): void {

        if (this._localStorageDB.doesTableExist("profiles")) {
            this._localStorageDB.createTable("profiles", ["name", "currentScreen"]);
            this._localStorageDB.insert("profiles", {name: "", currentScreen: "hello"});
        }

    }

}

const game: Game = new Game();
game.init();
