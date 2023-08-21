import {GameComponent} from "@lib/ecs/gameComponent";


export class TransparentComponent implements GameComponent {

    private _alpha: number = 1;

    constructor(alpha: number = 1) {
        this._alpha = alpha;
    }

    get alpha(): number {
        return this._alpha;
    }

    set alpha(alpha: number) {
        this._alpha = alpha;
    }


    getName(): string {
        return "transparentWall";
    }

}
