import {GameComponent} from "@lib/ecs/gameComponent";


export class PushWallComponent implements GameComponent {

    private _openWall: boolean = false;

    openWall() {
        this._openWall = true;
    }

    isWallOpen(): boolean {
        return this._openWall;
    }

    getName(): string {
        return "pushWall";
    }

}
