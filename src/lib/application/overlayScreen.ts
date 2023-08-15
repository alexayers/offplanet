import {MouseButton} from "@lib/input/mouse";


export interface OverlayScreen {
    init(): void

    logicLoop(): void

    renderLoop(): void

    keyboard(keyCode: number): void

    mouseMove(x: number, y: number): void

    mouseClick(x: number, y: number, mouseButton: MouseButton): void

    isActive(): boolean

    enable(): void

    disable(): void
}

export class OverlayBase {
    protected _active: boolean;

    public setActive(active: boolean): void {
        this._active = active;
    }

    public getActive(): boolean {
        return this._active;
    }
}
