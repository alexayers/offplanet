import {ButtonWidget} from "./buttonWidget";
import {Sprite} from "../rendering/sprite";
import {LabelWidget} from "@lib/ui/labelWidget";


export class ImageButtonWidget extends ButtonWidget {

    private _image: Sprite;
    private _hoverImage: Sprite;
    private _label: LabelWidget;


    get label(): LabelWidget {
        return this._label;
    }

    set label(value: LabelWidget) {
        this._label = value;
    }

    set image(image: Sprite) {
        this._image = image;
    }

    get image() {
        return this._image
    }

    set hoverImage(image: Sprite) {
        this._hoverImage = image;
    }

    get hoverImage() {
        return this._hoverImage
    }

    render(offsetX: number, offsetY: number): void {

        if (this.isMouseOver) {
            this._hoverImage.render(this.x + offsetX, this.y + offsetY, this.width, this.height);
        } else {
            this._image.render(this.x + offsetX, this.y + offsetY, this.width, this.height);
        }

        if (this.label) {
            this.label.render(offsetX + this.x, offsetY + this.y);
        }

    }

}

export class ImageButtonWidgetBuilder {

    private readonly _imageButtonWidget: ImageButtonWidget;

    constructor(x: number, y: number, width: number, height: number) {
        this._imageButtonWidget = new ImageButtonWidget();
        this._imageButtonWidget.x = x;
        this._imageButtonWidget.y = y;
        this._imageButtonWidget.width = width;
        this._imageButtonWidget.height = height;
    }

    withId(id: string): ImageButtonWidgetBuilder {
        this._imageButtonWidget.id = id;
        return this;
    }

    withLabel(label: LabelWidget): ImageButtonWidgetBuilder {

        this._imageButtonWidget.label = label;
        return this;
    }

    withImage(image: Sprite): ImageButtonWidgetBuilder {
        this._imageButtonWidget.image = image;
        return this;
    }

    withHoverImage(image: Sprite): ImageButtonWidgetBuilder {
        this._imageButtonWidget.hoverImage = image;
        return this;
    }

    withCallBack(callback: Function): ImageButtonWidgetBuilder {
        this._imageButtonWidget.callBack = callback;
        return this;
    }

    build(): ImageButtonWidget {
        return this._imageButtonWidget;
    }


}
