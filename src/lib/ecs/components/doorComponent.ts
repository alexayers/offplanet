import {GameComponent} from "@lib/ecs/gameComponent";


export class DoorComponent implements GameComponent {

    private _open: boolean = false;

    openDoor(): void {
        this._open = true;
    }

    closeDoor(): void {
        this._open = false;
    }

    isOpen(): boolean {
        return this._open;
    }

    getName(): string {
        return "door";
    }

}
