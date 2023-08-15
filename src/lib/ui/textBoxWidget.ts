import {Widget} from "@lib/ui/widget";
import {Color} from "@lib/primatives/color";
import {Renderer} from "@lib/rendering/renderer";
import {Font} from "@lib/rendering/font";
import {Colors} from "@lib/utils/colorUtils";
import {KeyboardInput, keyCodeToAlpha} from "@lib/input/keyboard";


export class TextBoxWidget extends Widget {

    private _buffer: string = "";
    private _color: Color;
    private _outlineColor: Color;
    private _font: Font = {
        family: "Arial",
        size: 12,
        color: Colors.BLACK()
    }

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    get font(): Font {
        return this._font;
    }

    set font(value: Font) {
        this._font = value;
    }

    keyboard(keyCode: number): void {

        if (KeyboardInput.DELETE == keyCode) {
            this.removeText();
        } else {
            this.addText(keyCodeToAlpha(keyCode));
        }


    }

    addText(ch: string): void {
        this._buffer += ch;
    }

    removeText(): void {

        if (this._buffer.length > 0) {
            this._buffer = this.buffer.substring(0, this.buffer.length - 1);
        }

    }

    get buffer(): string {
        return this._buffer;
    }

    set buffer(value: string) {
        this._buffer = value;
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    get outlineColor(): Color {
        return this._outlineColor;
    }

    set outlineColor(value: Color) {
        this._outlineColor = value;
    }

    render(offsetX: number, offsetY: number): void {

        Renderer.rect(offsetX + this.x - 1, offsetY + this.y - 1, this.width + 2, this.height + 2, this.outlineColor);
        Renderer.rect(offsetX + this.x, offsetY + this.y, this.width, this.height, this.color);

        Renderer.print(this.buffer, offsetX + this.x + 1, offsetY + this.y + 2, this.font);

    }

}

export class TextBoxWidgetBuilder {

    private _textBoxWidget: TextBoxWidget;

    constructor(x: number, y: number, width: number, height: number) {
        this._textBoxWidget = new TextBoxWidget(x, y, width, height);
    }

    withBorderColor(color: Color): TextBoxWidgetBuilder {
        this._textBoxWidget.outlineColor = color;
        return this;
    }

    withColor(color: Color): TextBoxWidgetBuilder {
        this._textBoxWidget.color = color;
        return this;
    }

    withFont(font: Font): TextBoxWidgetBuilder {
        this._textBoxWidget.font = font;
        return this;
    }

    build(): TextBoxWidget {
        return this._textBoxWidget;
    }
}
