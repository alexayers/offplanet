import {GameComponent} from "@lib/ecs/gameComponent";


export class DistanceComponent implements GameComponent {

    private _distance: number;


    get distance(): number {
        return this._distance;
    }

    set distance(value: number) {
        this._distance = value;
    }

    getName(): string {
        return "distance";
    }


}
