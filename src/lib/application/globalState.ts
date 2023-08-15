export class GlobalState {

    private static _stateMap: Map<string, any> = new Map<string, any>();
    private static _changeListeners: Map<string, Array<Function>> = new Map<string, Array<Function>>();

    static createState(key: string, state: any): void {
        GlobalState._stateMap.set(key, state);
    }

    static updateState(key: string, state: any): void {
        GlobalState._stateMap.set(key, state);

        GlobalState._changeListeners.get(key).forEach((callback) : void => {
            callback();
        });

    }

    static getState(key: string): any {
        return GlobalState._stateMap.get(key);
    }

    static hasState(key: string): boolean {
        return GlobalState._stateMap.has(key);
    }

    static clearState(key: string): void {
        GlobalState._stateMap.delete(key);
    }

    static getStates(): Map<string, any> {
        return this._stateMap;
    }

    static registerChangeListener(key: string, callBack: () => void) {
        if (!GlobalState._changeListeners.has(key)) {
            GlobalState._changeListeners.set(key, new Array<Function>());
        }

        GlobalState._changeListeners.get(key).push(callBack);

    }
}
