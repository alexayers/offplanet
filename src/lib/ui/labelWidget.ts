import {Widget} from "./widget";
import {Renderer} from "../rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";
import {Font} from "@lib/rendering/font";

export class LabelWidget extends Widget {

    private _label: string;
    private _font: Font = {
        family: "Arial",
        color: Colors.BLACK(),
        size: 12
    };
    private _hoverFont: Font = {
        family: "Arial",
        color: Colors.BLACK(),
        size: 12
    };


    get font(): Font {
        return this._font;
    }

    set font(value: Font) {
        this._font = value;
    }


    get hoverFont(): Font {
        return this._hoverFont;
    }

    set hoverFont(value: Font) {
        this._hoverFont = value;
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    render(offsetX: number, offsetY: number): void {

        let lines: Array<string> = Renderer.getLines(this._label, this._width);
        let lineOffsetY: number = 0;


        lines.forEach((line: string) => {
            Renderer.print(line, this._x + offsetX, this._y + offsetY + lineOffsetY, this._font);
            lineOffsetY += 20;
        });


    }

    renderHover(offsetX: number, offsetY: number): void {

        if (this._hoverFont != null) {
            Renderer.print(this._label, this._x + offsetX, this._y + offsetY, this._hoverFont);
        } else {
            this.render(offsetX, offsetY);
        }

    }
}

export class LabelWidgetBuilder {

    private _labelWidget: LabelWidget;

    constructor(x: number, y: number) {
        this._labelWidget = new LabelWidget();
        this._labelWidget.x = x;
        this._labelWidget.y = y;
        this._labelWidget.width = 200;
    }

    withId(id: string): LabelWidgetBuilder {
        this._labelWidget.id = id;
        return this;
    }

    withLabel(label: string): LabelWidgetBuilder {
        this._labelWidget.label = label;
        return this;
    }

    withWidth(width: number): LabelWidgetBuilder {
        this._labelWidget.width = width;
        return this;
    }

    withFont(font: Font): LabelWidgetBuilder {
        this._labelWidget.font = font;
        return this;
    }

    withHoverFont(font: Font): LabelWidgetBuilder {
        this._labelWidget.hoverFont = font;
        return this;
    }

    build(): LabelWidget {
        return this._labelWidget;
    }


}
