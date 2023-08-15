import {Widget} from "@lib/ui/widget";
import {Color} from "@lib/primatives/color";
import {Renderer} from "@lib/rendering/renderer";
import {calculateXPercentOfY} from "@lib/utils/mathUtils";


export class ProgressBarWidget extends Widget {

    private _backgroundColor: Color;
    private _progressBarColor: Color;
    private _outlineColor: Color;
    private _progressTextColor: Color;
    private _percent: number = 0;

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }


    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    set backgroundColor(value: Color) {
        this._backgroundColor = value;
    }

    get progressBarColor(): Color {
        return this._progressBarColor;
    }

    set progressBarColor(value: Color) {
        this._progressBarColor = value;
    }

    get outlineColor(): Color {
        return this._outlineColor;
    }

    set outlineColor(value: Color) {
        this._outlineColor = value;
    }

    get percent(): number {
        return this._percent;
    }

    set percent(value: number) {

        if (value <= 100) {
            this._percent = value;
        }

    }


    get progressTextColor(): Color {
        return this._progressTextColor;
    }

    set progressTextColor(value: Color) {
        this._progressTextColor = value;
    }

    render(offsetX: number, offsetY: number): void {


        Renderer.rect(this._x + offsetX - 1, this._y + offsetY - 1, this._width + 2, this._height + 2, this._outlineColor);
        Renderer.rect(this._x + offsetX, this._y + offsetY, this._width, this._height, this._backgroundColor);


        let newWidth: number = calculateXPercentOfY(this._percent, this.width);

        Renderer.rect(this._x + offsetX, this._y + offsetY, newWidth, this._height, this._progressBarColor);
    }

}

export class ProgressBarWidgetBuilder {

    private _progressBarWidget: ProgressBarWidget;

    constructor(x: number, y: number, width: number, height: number) {
        this._progressBarWidget = new ProgressBarWidget(x, y, width, height);
    }

    withId(id: string): ProgressBarWidgetBuilder {
        this._progressBarWidget.id = id;
        return this;
    }

    withBackgroundColor(color: Color): ProgressBarWidgetBuilder {
        this._progressBarWidget.backgroundColor = color;
        return this;
    }

    withOutlineColor(color: Color): ProgressBarWidgetBuilder {
        this._progressBarWidget.outlineColor = color;
        return this;
    }

    withProgressBarColor(color: Color): ProgressBarWidgetBuilder {
        this._progressBarWidget.progressBarColor = color;
        return this;
    }

    withProgressBarTextColor(color: Color): ProgressBarWidgetBuilder {
        this._progressBarWidget.progressTextColor = color;
        return this;
    }

    build(): ProgressBarWidget {
        return this._progressBarWidget;
    }

}
