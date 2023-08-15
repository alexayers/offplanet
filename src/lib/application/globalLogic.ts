export class GlobalLogic {

    static globalCallBacks: Array<Function> = [];


    static registerLogic(func: Function): void {
        this.globalCallBacks.push(func);
    }

    static execute(): void {

        this.globalCallBacks.forEach((func) => {
            func();
        });

    }

}
