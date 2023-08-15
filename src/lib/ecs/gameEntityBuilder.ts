import {GameEntity} from "./gameEntity";
import {GameComponent} from "./gameComponent";


export class GameEntityBuilder {

    private readonly _gameEntity: GameEntity;

    constructor(name: string) {
        this._gameEntity = new GameEntity();
        this._gameEntity.name = name;
    }

    addComponent(gameComponent: GameComponent): GameEntityBuilder {
        this._gameEntity.addComponent(gameComponent);
        return this;
    }

    build(): GameEntity {
        return this._gameEntity;
    }

}
