import {Color} from "../primatives/color";

export function RGBtoHex(red: number, green: number, blue: number): string {

    try {
        return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    } catch (e) {
        return "#ffffff";
    }
}


function componentToHex(c: number) {
    let hex: string = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


export class Colors {

    private static COLOR_BLACK: Color = new Color(0, 0, 0, 1);
    private static COLOR_WHITE: Color = new Color(255, 255, 255, 1);
    private static COLOR_LTGRAY: Color = new Color(190, 190, 190, 1);
    private static COLOR_RED: Color = new Color(255, 0, 0, 1);
    private static COLOR_BLUE: Color = new Color(0, 0, 255, 1);
    private static COLOR_GREEN: Color = new Color(0, 100, 0, 1);
    private static COLOR_DRKGRAY: Color = new Color(100, 100, 100, 1);

    static BLACK(): Color {
        return Colors.COLOR_BLACK;
    }

    static LTGRAY(): Color {
        return Colors.COLOR_LTGRAY;
    }

    static DRKGRAY(): Color {
        return Colors.COLOR_DRKGRAY;
    }

    static RED(): Color {
        return Colors.COLOR_RED;
    }

    static BLUE(): Color {
        return Colors.COLOR_BLUE;
    }

    static GREEN(): Color {
        return Colors.COLOR_GREEN
    }

    static WHITE(): Color {
        return Colors.COLOR_WHITE;
    }
}
