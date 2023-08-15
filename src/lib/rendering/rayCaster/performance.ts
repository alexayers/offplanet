export class Performance {

    static frameCount: number = 0;
    static lastFrame: number;
    static frameTime: number;
    static deltaTime: number;

    static updateFrameTimes(): void {
        Performance.frameCount++;
        Performance.frameTime = performance.now() - Performance.lastFrame;
        Performance.deltaTime = Performance.frameTime / (1000 / 60);
        Performance.lastFrame = performance.now();

    }


}





