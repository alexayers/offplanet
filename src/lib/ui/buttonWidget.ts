import {Widget} from "./widget";
import {Color} from "../primatives/color";
import {Renderer} from "../rendering/renderer";
import {LabelWidget} from "./labelWidget";
import {Colors} from "@lib/utils/colorUtils";


export class ButtonWidget extends Widget {

    private _labels: Array<LabelWidget> = [];
    protected _color: Color = Colors.WHITE();
    protected _hoverColor: Color = Colors.BLACK();
    protected _clickedColor: Color = Colors.BLACK();
    private _hoverCursor: string;
    private _outlineColor: Color = Colors.BLACK();


    get outlineColor(): Color {
        return this._outlineColor;
    }

    set outlineColor(value: Color) {
        this._outlineColor = value;
    }

    get labels(): Array<LabelWidget> {
        return this._labels;
    }

    addLabel(label: LabelWidget): void {
        this._labels.push(label);
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    get hoverColor(): Color {
        return this._hoverColor;
    }

    set hoverColor(value: Color) {
        this._hoverColor = value;
    }

    get clickedColor(): Color {
        return this._clickedColor;
    }

    set clickedColor(value: Color) {
        this._clickedColor = value;
    }


    get hoverCursor(): string {
        return this._hoverCursor;
    }

    set hoverCursor(value: string) {
        this._hoverCursor = value;
    }

    render(offsetX: number, offsetY: number): void {


        if (this._outlineColor) {
            Renderer.rect(this.x + offsetX - 1, this.y + offsetY - 1, this.width + 2, this.height + 2, this.outlineColor);
        }

        if (this.isMouseOver) {

            if (this._hoverCursor) {
                document.body.style.cursor = this._hoverCursor;
            }

            if (this.hoverColor) {
                Renderer.rect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.hoverColor);
            }


            this._labels.forEach((label: LabelWidget) => {
                if (label != null) {
                    label.renderHover(this.x + offsetX, this.y + offsetY + (this.height / 2));
                }
            });


        } else {
            document.body.style.cursor = "default";

            if (this.color) {
                Renderer.rect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.color);
            }


            this._labels.forEach((label: LabelWidget) => {
                if (label != null) {
                    label.render(this.x + offsetX, this.y + offsetY + (this.height / 2));
                }
            });

        }


    }


}

export class ButtonWidgetBuilder {

    private readonly _buttonWidget: ButtonWidget;

    constructor(x: number, y: number, width: number, height: number) {
        this._buttonWidget = new ButtonWidget();
        this._buttonWidget.x = x;
        this._buttonWidget.y = y;
        this._buttonWidget.width = width;
        this._buttonWidget.height = height;
    }

    withId(id: string): ButtonWidgetBuilder {
        this._buttonWidget.id = id;
        return this;
    }

    withHoverCursor(cursor: string): ButtonWidgetBuilder {
        this._buttonWidget.hoverCursor = cursor;
        return this;
    }

    withColor(color: Color): ButtonWidgetBuilder {
        this._buttonWidget.color = color;
        return this;
    }

    withHoverColor(color: Color): ButtonWidgetBuilder {
        this._buttonWidget.hoverColor = color;
        return this;
    }


    withOutlineColor(color: Color): ButtonWidgetBuilder {
        this._buttonWidget.outlineColor = color;
        return this;
    }

    withClickedColor(color: Color): ButtonWidgetBuilder {
        this._buttonWidget.clickedColor = color;
        return this;
    }

    withLabel(label: LabelWidget): ButtonWidgetBuilder {
        this._buttonWidget.addLabel(label);
        return this;
    }

    withCallBack(callback: Function): ButtonWidgetBuilder {

        if (this._buttonWidget.callBack) {
            throw Error("You've already defined a callback")
        }

        this._buttonWidget.callBack = callback;
        return this;
    }

    build(): ButtonWidget {
        return this._buttonWidget;
    }


}
