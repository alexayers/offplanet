import {Point} from "@lib/primatives/point";

export const CIRCLE: number = Math.PI * 2;

export function getDecimal(n: number): number {
    return (n - Math.floor(n));
}

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * (max - 1 + 1) + 1);
}

export function rotateVector(vx: number, vy: number, angle: number): Point {

    return {
        x: vx * Math.cos(angle) - vy * Math.sin(angle),
        y: vx * Math.sin(angle) + vy * Math.cos(angle)
    }
}

export function getRandomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isPointWithinQuad(point: Point, x: number, y: number, width: number, height: number): boolean {

    if (point.x >= x &&
        point.x <= x + width &&
        point.y >= y &&
        point.y <= y + height) {
        return true;
    } else {
        return false;
    }
}

export function getRandomArrayElement(array: Array<any>): number {
    return getRandomBetween(0, array.length - 1);
}

export function distanceBetweenTwoPixelCoords(x1: number, y1: number, x2: number, y2: number): number {
    return Math.hypot(x1 - x2, y1 - y2);
}

export function positiveNegative(): number {
    if (getRandomInt(10) > 5) {
        return -1;
    } else {
        return 1;
    }
}

export function calculateXPercentOfY(x: number, y: number): number {
    return (x / 100) * y;
}

export function calculatePercent(current: number, total: number): number {
    return Math.floor((current / total) * 100);
}
