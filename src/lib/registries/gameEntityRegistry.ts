import {GameEntity} from "@lib/ecs/gameEntity";
import {DistanceComponent} from "@lib/ecs/components/distanceComponent";
import {uuid} from "@lib/utils/idUtilts";
import cloneDeep from 'lodash.clonedeep';

export class GameEntityRegistry {

    private static _instance: GameEntityRegistry = null;
    private _entities: Map<string, GameEntity>;
    private _singletonEntities: Map<string, GameEntity>;


    private constructor() {
    }

    static getInstance(): GameEntityRegistry {
        if (GameEntityRegistry._instance == null) {
            GameEntityRegistry._instance = new GameEntityRegistry();
            GameEntityRegistry._instance._entities = new Map<string, GameEntity>();
            GameEntityRegistry._instance._singletonEntities = new Map<string, GameEntity>();
        }

        return GameEntityRegistry._instance;
    }

    register(gameEntity: GameEntity): void {

        gameEntity.addComponent(new DistanceComponent());
        this._entities.set(gameEntity.name, gameEntity);
    }

    registerSingleton(gameEntity: GameEntity): void {
        this._singletonEntities.set(gameEntity.name, gameEntity);
    }

    getSingleton(name: string): GameEntity {
        return this._singletonEntities.get(name);
    }

    getEntities(): Map<string, GameEntity> {
        return this._entities;
    }

    getLazyEntity(name: string): any {

        if (!this._entities.has(name)) {
            throw new Error(`Entity ${name} is not found`);
        }

        return this._entities.get(name);
    }

    getEntity(name: string): any {

        if (!this._entities.has(name)) {
            throw new Error(`Entity ${name} is not found`);
        }

        let gameEntity: GameEntity = cloneDeep(this._entities.get(name));
        gameEntity.id = uuid();

        return gameEntity;
    }


}
