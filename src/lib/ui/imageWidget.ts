import {Widget} from "@lib/ui/widget";
import {Renderer} from "@lib/rendering/renderer";


export class ImageWidget extends Widget {

    private _image: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    get image(): HTMLImageElement {
        return this._image;
    }

    set image(value: any) {
        this._image = new Image();
        this._image.src = value;

    }

    render(offsetX: number, offsetY: number): void {
        Renderer.renderImage(this.image, this.x + offsetX, this.y + offsetY, this.width, this.height);
    }

}


export class ImageWidgetBuilder {

    private _imageWidget: ImageWidget;

    constructor(x: number, y: number, width: number, height: number) {
        this._imageWidget = new ImageWidget(x, y, width, height);
    }

    withSprite(image: any): ImageWidgetBuilder {
        this._imageWidget.image = image;
        return this;
    }

    build() {
        return this._imageWidget;
    }
}
