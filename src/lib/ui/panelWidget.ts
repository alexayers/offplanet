import {Widget} from "@lib/ui/widget";
import {Color} from "@lib/primatives/color";
import {Renderer} from "@lib/rendering/renderer";
import {Colors} from "@lib/utils/colorUtils";


export class PanelWidget extends Widget {

    private _color: Color;
    private _widgets: Map<string, Widget> = new Map<string, Widget>();

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    addWidget(widget: Widget): void {
        this._widgets.set(widget.id, widget);
    }

    get widgets(): Map<string, Widget> {
        return this._widgets;
    }

    clear(): void {
        this._widgets.clear();
    }

    render(offsetX: number, offsetY: number): void {

        Renderer.rect(this._x + offsetX - 1, this._y + offsetY - 1, this.width + 2, this.height + 2, Colors.BLACK());
        Renderer.rect(this._x + offsetX, this._y + offsetY, this.width, this.height, this._color);

        this._widgets.forEach((widget) => {
            widget.render(this._x + offsetX, this._y + offsetY);
        });

    }

}

export class PanelWidgetBuilder {
    private _panelWidget: PanelWidget;

    constructor(x: number, y: number, width: number, height: number) {
        this._panelWidget = new PanelWidget(x, y, width, height);
    }

    withId(id: string): PanelWidgetBuilder {
        this._panelWidget.id = id;
        return this;
    }

    withWidget(widget: Widget): PanelWidgetBuilder {
        this._panelWidget.addWidget(widget);
        return this;
    }

    withColor(color: Color): PanelWidgetBuilder {
        this._panelWidget.color = color;
        return this;
    }

    build(): PanelWidget {
        return this._panelWidget;
    }
}
