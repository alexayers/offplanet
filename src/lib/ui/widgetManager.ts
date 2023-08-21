import {Widget} from "./widget";
import {MouseButton} from "../input/mouse";
import {WindowWidget} from "@lib/ui/windowWidget";
import {isPointWithinQuad} from "@lib/utils/mathUtils";
import {PanelWidget} from "@lib/ui/panelWidget";
import {TextBoxWidget} from "@lib/ui/textBoxWidget";

export class WidgetManager {

    private _widgets: Map<string, Widget>;
    private _widgetInFocus: Widget;

    constructor() {
        this._widgets = new Map<string, Widget>();
    }

    register(widget: Widget, id: string = widget.id): void {

        if (!this._widgets.has(id)) {
            widget.id = id;
            this._widgets.set(id, widget);
        }

    }

    render(): void {

        this._widgets.forEach((widget: Widget) => {
            widget.render(0, 0);
        });

    }

    close(id: string): void {
        this._widgets.forEach((widget: Widget) => {
            if (widget instanceof WindowWidget && widget.id == id) {
                widget.close();
            } else {

            }
        });
    }

    delete(id: string): void {
        this._widgets.delete(id);
    }

    mouseMove(x: number, y: number): void {

        this._widgets.forEach((widget: Widget) => {

            if (widget instanceof WindowWidget) {
                widget.mouseMove(x, y);
            } else if (widget instanceof PanelWidget) {

                let panelWidget: PanelWidget = widget as PanelWidget;

                panelWidget.widgets.forEach((widget: Widget) => {
                    if (isPointWithinQuad({
                        x: x,
                        y: y
                    }, widget.x, widget.y, widget.width, widget.height)) {
                        widget.isMouseOver = true;
                    } else {
                        widget.isMouseOver = false;
                    }
                });

            } else {

                if (x >= widget.x &&
                    x <= (widget.x + widget.width) &&
                    y >= widget.y &&
                    y <= (widget.y + widget.height)) {
                    widget.isMouseOver = true;
                } else {
                    widget.isMouseOver = false;
                }

            }
        });
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton) {
        this._widgets.forEach((widget: Widget) => {

                if (widget instanceof WindowWidget) {


                    widget.mouseClick(x, y, mouseButton);
                    this._widgetInFocus = widget;

                } else if (widget instanceof PanelWidget) {

                    let panelWidget: PanelWidget = widget as PanelWidget;

                    panelWidget.widgets.forEach((widget: Widget) => {
                        if (isPointWithinQuad({
                            x: x,
                            y: y
                        }, widget.x, widget.y, widget.width, widget.height)) {

                            if (mouseButton == MouseButton.LEFT) {
                                if (widget.callBack != null) {
                                    widget.invoke();
                                }


                            }
                        }
                    });

                } else {
                    if (isPointWithinQuad({x: x, y: y}, widget.x, widget.y, widget.width, widget.height))
                        if (mouseButton == MouseButton.LEFT) {
                            if (widget.callBack != null) {
                                widget.invoke();
                            }
                        }
                }


            }
        );
    }

    keyboard(keyCode: number) {
        if (this._widgetInFocus) {

            if (this._widgetInFocus instanceof WindowWidget) {


                if (this._widgetInFocus.getWidgetInFocus() instanceof TextBoxWidget) {

                    let textBoxWidget: TextBoxWidget = this._widgetInFocus.getWidgetInFocus() as TextBoxWidget;
                    //  textBoxWidget.keyboard(keyCode);
                }

            } else {
                if (this._widgetInFocus instanceof TextBoxWidget) {
                    //     this._widgetInFocus.keyboard(keyCode);
                }
            }


        }
    }
}
