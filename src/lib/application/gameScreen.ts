import {MouseButton} from "../input/mouse";


export interface GameScreen {
    init(): void;

    onEnter(): void;

    onExit(): void;

    logicLoop(): void;

    renderLoop(): void;

    keyboard(): void;

    mouseClick(x: number, y: number, mouseButton: MouseButton): void;

    mouseMove(x: number, y: number): void;
}
