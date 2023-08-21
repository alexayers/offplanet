/*
    This just takes an image and outputs a map understood by the game engine.
 */

import * as fs from 'fs';


let lookUpMap: Map<string, number> = new Map<string, number>();

lookUpMap.set("ffffff", 0); // floor
lookUpMap.set("000000", 1); // wall
lookUpMap.set("ff0000", 2); // station wall
lookUpMap.set("0013ff", 3); // lab door

lookUpMap.set("525252", 4); // airlock
lookUpMap.set("fbff00", 5); // airlock warning
lookUpMap.set("00ff00", 6); // air filter
lookUpMap.set("3b240f", 7); // workshop wall
lookUpMap.set("5e83a7", 8); // freezer walll
lookUpMap.set("c416cb", 9); // generator wall
lookUpMap.set("f58c4a", 10); // data center wall

lookUpMap.set("00bedf", 11); // kitchen storage
lookUpMap.set("0e1e21", 12); // kitchen oven
lookUpMap.set("f5009d", 13); // Bed
lookUpMap.set("dcdcdc", 14); // glass
lookUpMap.set("00711e", 15); // plants
lookUpMap.set("383d5b", 16); // bedroom
lookUpMap.set("585858", 17); // backroom
lookUpMap.set("1d1d1d", 18); // backroom vent
lookUpMap.set("ff9c00", 19); // backroom door
lookUpMap.set("93aecc", 20); // freezer door
lookUpMap.set("f26d00", 21); // airlock door
lookUpMap.set("c96504", 22); // inner airlock door


(async () => {

    const PNG = require('png-js');

    let totalPixels: number = 0;
    let totalColors: number = 0;

    let colors: Array<string> = [];
    let grid: Array<number> = new Array<number>();

    PNG.decode('./src/assets/images/map.png', function (pixels: Array<number>): void {
        for (let i: number = 0; i < pixels.length; i += 4) {
            let r: number = pixels[i];
            let g: number = pixels[i + 1];
            let b: number = pixels[i + 2];
            let a: number = pixels[1 + 3];

            let color: string = RGBtoHex(r, g, b);

            if (!lookUpMap.has(color)) {
                throw new Error(`Can't process ${color} at ${i / 4}`)
            }
            let translation: number = lookUpMap.get(color);
            grid.push(translation);

            totalPixels++;
        }

        fs.writeFileSync("map.txt", JSON.stringify(grid) + "\r\n");


        console.log(totalPixels);
    });


})();


function RGBtoHex(red: number, green: number, blue: number): string {

    try {
        return "" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    } catch (e) {
        return "ffffff";
    }
}

function componentToHex(c: number) {
    let hex: string = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
