import {Performance} from "@lib/rendering/rayCaster/performance";
import {GameEntity} from "@lib/ecs/gameEntity";
import {DoorComponent} from "@lib/ecs/components/doorComponent";
import {PushWallComponent} from "@lib/ecs/components/pushWallComponent";
import {Color} from "@lib/primatives/color";
import {Sprite} from "@lib/rendering/sprite";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";

//0: Closed, 1: Opening, 2: Open, 3: Closing

export enum DoorState {
    CLOSED = 0,
    OPENING = 1,
    OPEN = 2,
    CLOSING = 3
}

export interface WorldMap {
    grid: Array<number>,
    items?: Array<GameEntity>
    skyBox?: Sprite
    skyColor: Color
    floorColor: Color
    translationTable: Map<number, GameEntity>
    lightRange: number
    width: number
    height: number
}

export class World {

    private static _instance: World = null;

    private _worldMap: WorldMap;
    private _gameMap: Array<GameEntity>;
    private _worldWidth: number = 24;
    private _worldHeight: number = 24;
    private _doorOffsets: Array<number> = [];
    private _doorStates: Array<number> = [];
    private _gameEntityRegistry: GameEntityRegistry = GameEntityRegistry.getInstance();

    static getInstance(): World {

        if (World._instance == null) {
            World._instance = new World();
        }

        return World._instance;
    }

    loadMap(worldMap: WorldMap): void {

        this._worldMap = worldMap;
        this._worldHeight = worldMap.height;
        this._worldWidth = worldMap.width;
        this._gameMap = [];

        for (let y: number = 0; y < this._worldHeight; y++) {
            for (let x: number = 0; x < this._worldWidth; x++) {
                let pos: number = x + (y * this._worldWidth);
                let value: number = worldMap.grid[pos];
                this._gameMap[pos] = this._gameEntityRegistry.getLazyEntity(worldMap.translationTable.get(value).name);
            }
        }

        for (let i: number = 0; i < World._instance._worldWidth * World._instance._worldHeight; i++) {
            World._instance._doorOffsets.push(0);
            World._instance._doorStates.push(0);
        }
    }

    getWorldMap(): WorldMap {
        return this._worldMap;
    }


    getWorldItems(): Array<GameEntity> {
        return this._worldMap.items;
    }

    removeWorldItem(item: GameEntity): void {

        const index = this._worldMap.items.indexOf(item, 0);

        if (index > -1) {
            this._worldMap.items.splice(index, 1);
        }

    }

    getPosition(x: number, y: number): GameEntity {
        return this._gameMap[(x + (y * this._worldWidth))];
    }

    get gameMap() {
        return this._gameMap;
    }

    getDoorState(x: number, y: number): number {
        return this._doorStates[x * (y * this._worldWidth)];
    }

    getDoorOffset(x: number, y: number): number {
        return this._doorOffsets[x * (y * this._worldWidth)];
    }

    setDoorState(x: number, y: number, state: number): void {
        this._doorStates[x * (y * this._worldWidth)] = state;
    }

    setDoorOffset(x: number, y: number, offset: number): void {
        this._doorOffsets[x * (y * this._worldWidth)] = offset;
    }

    moveDoors(): void {

        for (let y: number = 0; y < this._worldHeight; y++) {
            for (let x: number = 0; x < this._worldWidth; x++) {

                let gameEntity: GameEntity = this.getPosition(x, y);

                if (gameEntity.hasComponent("door")) { //Standard door
                    if (this.getDoorState(x, y) == DoorState.OPENING) {//Open doors
                        this.setDoorOffset(x, y, this.getDoorOffset(x, y) + Performance.deltaTime / 100);

                        if (this.getDoorOffset(x, y) > 1) {
                            this.setDoorOffset(x, y, 1);
                            this.setDoorState(x, y, DoorState.OPEN);//Set state to open

                            let door: DoorComponent = gameEntity.getComponent("door") as DoorComponent;
                            door.openDoor();

                            setTimeout((): void => {
                                this.setDoorState(x, y, DoorState.CLOSING);

                                let door: DoorComponent = gameEntity.getComponent("door") as DoorComponent;
                                door.closeDoor();

                            }, 5000);//TO DO: Don't close when player is in tile
                        }
                    } else if (this.getDoorState(x, y) == DoorState.CLOSING) {
                        this.setDoorOffset(x, y, this.getDoorOffset(x, y) - Performance.deltaTime / 100);

                        if (this.getDoorOffset(x, y) < 0) {
                            this.setDoorOffset(x, y, 0);
                            this.setDoorState(x, y, DoorState.CLOSED);

                            let door: DoorComponent = gameEntity.getComponent("door") as DoorComponent;
                            door.closeDoor();
                        }
                    }
                } else if (gameEntity.hasComponent("pushWall")) {
                    if (this.getDoorState(x, y) == DoorState.OPENING) {
                        this.setDoorOffset(x, y, this.getDoorOffset(x, y) + Performance.deltaTime / 100);

                        if (this.getDoorOffset(x, y) > 2) {
                            this.setDoorOffset(x, y, 2);
                            this.setDoorState(x, y, DoorState.OPEN);

                            let pushWall: PushWallComponent = gameEntity.getComponent("pushWall") as PushWallComponent;
                            pushWall.openWall();
                        }
                    }
                }
            }
        }
    }

    removeWall(x: number, y: number): void {
        let pos: number = x + (y * this._worldWidth);
        this._gameMap[pos] = this._gameEntityRegistry.getLazyEntity("floor");
    }

    placeTile(x: number, y: number, newEntity: any): void {
        let pos: number = x + (y * this._worldWidth);
        this._gameMap[pos] = newEntity;
    }
}
