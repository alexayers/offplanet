export class Timer {

    private _startTime: number = 0;
    private _waitTime: number = 0;

    start(waitTime: number): void {
        this._waitTime = waitTime;
        this._startTime = Date.now();
    }

    reset(): void {
        this._startTime = Date.now();
    }

    isTimePassed(): boolean {
        return this._startTime + this._waitTime < Date.now();
    }
}
