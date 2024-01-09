import {GlobalState} from "@lib/application/globalState";

export enum KeyboardInput {
    ESCAPE = 27,
    SPACE = 32,
    SHIFT = 16,
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39,
    ENTER = 13,
    DELETE = 8,
    ONE = 49,
    TWO = 50,
    THREE = 51,
    FOUR = 52,
    FIVE = 53,
    SIX = 54,
    SEVEN = 55,
    EIGHT = 56,
    NINE = 57,
    ZERO = 48,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    isDown
}

export function isKeyDown(keyCode: number) : boolean {
    return GlobalState.getState(`KEY_${keyCode}`);
}


export function keyCodeToAlpha(keyCode: number): string {
    switch (keyCode) {
        case 65:
            return "a";
        case 66:
            return "b";
        case 67:
            return "c";
        case 68:
            return "d";
        case 69:
            return "e";
        case 70:
            return "f";
        case 71:
            return "g";
        case 72:
            return "h";
        case 73:
            return "i";
        case 74:
            return "j";
        case 75:
            return "k";
        case 76:
            return "l";
        case 77:
            return "m";
        case 78:
            return "n";
        case 79:
            return "o";
        case 80:
            return "p";
        case 81:
            return "q";
        case 82:
            return "r";
        case 83:
            return "s";
        case 84:
            return "t";
        case 85:
            return "u";
        case 86:
            return "v";
        case 87:
            return "w";
        case 88:
            return "x";
        case 89:
            return "y";
        case 90:
            return "z";
        default:
            return "";

    }
}
