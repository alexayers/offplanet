import {GameComponent} from "./gameComponent";
import {uuid} from "../utils/idUtilts";


export class GameEntity {

    private _id: string;
    private _name: string;
    private _gameComponents: Map<string, GameComponent>;

    constructor() {
        this._id = uuid();
        this._gameComponents = new Map<string, GameComponent>();
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    addComponent(gameComponent: GameComponent): void {
        this._gameComponents.set(gameComponent.getName(), gameComponent);
    }

    removeComponent(name: string): void {
        this._gameComponents.delete(name);
    }

    getComponents(): Map<String, GameComponent> {
        return this._gameComponents;
    }

    hasComponent(component: string): boolean {
        return this._gameComponents.has(component);
    }

    hasComponents(components: Array<string>): boolean {
        for (const component of components) {
            if (!this._gameComponents.has(component)) {
                return false;
            }
        }
        return true;
    }

    removeComponents(components: Array<string>): void {

        for (const component of components) {
            if (this._gameComponents.has(component)) {
                this._gameComponents.delete(component);
            }
        }

    }

    getComponent(name: string): GameComponent {
        return this._gameComponents.get(name);
    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
