import {Color} from "@lib/primatives/color";


export enum Fonts {
    ARIAL = "Arial"
}

export enum FontStyle {
    BOLD = "bold",
    ITALIC = "italic"
}

export interface Font {
    family?: string
    size?: number
    style?: FontStyle
    color?: Color
}
