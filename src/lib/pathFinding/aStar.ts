import {PathNode} from "./pathNode";

export interface GameMap {
    width: number
    height: number
    walls: Array<boolean>
}

export class AStar {

    private _closedSet: Map<number, PathNode> = new Map<number, PathNode>();
    private _openSet: Map<number, PathNode> = new Map<number, PathNode>();
    private _path: Array<PathNode> = new Array<PathNode>();
    private _currentNode: PathNode = new PathNode(0, 0);

    private readonly _startX: number;
    private readonly _startY: number;
    private readonly _endX: number;
    private readonly _endY: number;

    private readonly _gameMap: GameMap;


    private translateCoordinatesToIdx(x: number, y: number): number {
        return x + (y * this._gameMap.width);
    }


    public constructor(startX: number, startY: number, endX: number, endY: number, gameMap: GameMap) {
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
        this._gameMap = gameMap;

        let idx: number = this.translateCoordinatesToIdx(startX, startY);

        let n: PathNode = new PathNode(startX, startY);
        n.setIdx(idx);
        n.setParent(0);
        n.setG(0);
        n.setH(this.getManhattanDistance(n.getX(), n.getY()));
        n.setF(n.getG() + n.getH());

        this._openSet.set(idx, n);
    }

    private getManhattanDistance(x: number, y: number): number {
        return ((Math.abs(x - this._endX) + Math.abs(y - this._endY)) * 10);
    }

    private isOnClosedList(idx: number): boolean {

        // @ts-ignore
        for (let [k, pathNode] of this._closedSet) {
            if (pathNode.getIdx() == idx) {
                return true;
            }
        }

        return false;
    }

    private isOnOpenedList(idx: number): boolean {

        // @ts-ignore
        for (let [k, pathNode] of this._openSet) {
            if (pathNode.getIdx() == idx) {
                return true;
            }
        }

        return false;
    }

    private addToOpenedList(n: PathNode): void {
        this._openSet.set(n.getIdx(), n);
    }

    private addToClosedList(idx: number, n: PathNode): void {
        this._closedSet.set(idx, n);
    }

    private findLowestCost(): PathNode {
        let f: number = 99999;
        let lowestCostIdx: number = 0;

        // @ts-ignore
        for (let [k, pathNode] of this._openSet) {

            if (pathNode.getF() <= f) {
                f = pathNode.getF();
                lowestCostIdx = pathNode.getIdx();
            }
        }

        let lowestNode: PathNode = this._openSet.get(lowestCostIdx);
        this._openSet.delete(lowestCostIdx);
        return lowestNode;
    }

    private calculateGValue(x: number, y: number): number {
        // Checking behind me
        if (x == (this._currentNode.getX() - 1) && y == this._currentNode.getY()) {

            let pos: number = this.translateCoordinatesToIdx(this._currentNode.getX() - 1, this._currentNode.getY());
            let wall: boolean = this._gameMap.walls[pos];
            return this.getTileWeight(wall);

            // Checking in front of me
        } else if (x == (this._currentNode.getX() + 1) && y == this._currentNode.getY()) {
            let pos: number = this.translateCoordinatesToIdx(this._currentNode.getX() + 1, this._currentNode.getY());
            let wall: boolean = this._gameMap.walls[pos];
            return this.getTileWeight(wall);
            // Checking above me
        } else if (x == (this._currentNode.getX()) && y == this._currentNode.getY() + 1) {
            let pos: number = this.translateCoordinatesToIdx(this._currentNode.getX(), this._currentNode.getY() + 1);
            let wall: boolean = this._gameMap.walls[pos];
            return this.getTileWeight(wall);
            // Checking below me
        } else if (x == (this._currentNode.getX()) && y == this._currentNode.getY() - 1) {
            let pos: number = this.translateCoordinatesToIdx(this._currentNode.getX(), this._currentNode.getY() - 1);
            let wall: boolean = this._gameMap.walls[pos];
            return this.getTileWeight(wall);
            // Checking diagonal
        } else {
            return 1400;
        }
    }

    private getTileWeight(wall: boolean): number {

        if (!wall) {
            return 10;
        } else {
            return 100000;
        }
    }

    private buildNodeList(): void {

        for (let y = (this._currentNode.getY() + 1); y >= (this._currentNode.getY() - 1); y--) {
            for (let x = (this._currentNode.getX() - 1); x < (this._currentNode.getX() + 2); x++) {

                if (x == this._currentNode.getX() && y == this._currentNode.getY()) {
                    continue;
                } else {
                    if (y >= 0 &&
                        x >= 0 &&
                        x < (this._gameMap.width - 1) &&
                        y < (this._gameMap.height - 1)) {
                        let cost: number = this._currentNode.getG() + this.calculateGValue(x, y);
                        let idx: number = this.translateCoordinatesToIdx(x, y);

                        if (this.isOnOpenedList(idx) && cost < this._openSet.get(idx).getG()) {
                            this._openSet.get(idx).setG(cost);
                            this._openSet.get(idx).setF(this._openSet.get(idx).getG() + this._openSet.get(idx).getH());
                            this._openSet.get(idx).setParent(this._currentNode.getIdx());
                        } else if (this.isOnClosedList(idx)) {
                            continue;
                        } else if (!this.isOnOpenedList(idx)) {
                            let n: PathNode = new PathNode(0, 0);
                            n.setG(cost);
                            n.setX(x);
                            n.setY(y);
                            n.setH(this.getManhattanDistance(x, y));
                            n.setIdx(idx);
                            n.setParent(this._currentNode.getIdx());
                            n.setF(n.getG() + n.getH());
                            this.addToOpenedList(n);
                        }
                    }
                }
            }
        }
    }

    private buildRoute(): void {
        let startIdx: number = this.translateCoordinatesToIdx(this._startX, this._startY);
        let idx: number = this.translateCoordinatesToIdx(this._endX, this._endY);

        while (idx != startIdx) {
            this._path.push(this._closedSet.get(idx));
            idx = this._closedSet.get(idx).getParent();
        }
    }

    public getPath(): Array<PathNode> {
        return this._path;
    }

    public isPathFound(): boolean {
        let pathFound: boolean = false;

        while (this._openSet.size != 0) {
            this._currentNode = this.findLowestCost();
            this.addToClosedList(this._currentNode.getIdx(), this._currentNode);

            if (this._currentNode.getIdx() == this.translateCoordinatesToIdx(this._endX, this._endY)) {
                this.buildRoute();

                pathFound = true;
                break;
            } else {
                this.buildNodeList();
            }


        }

        return pathFound;
    }


}
