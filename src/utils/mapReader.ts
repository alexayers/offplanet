/*
    This just takes an image and outputs a map understood by the game engine.
 */

import * as fs from 'fs';


(async()=>{

    const PNG = require('png-js');

    let totalPixels : number = 0;
    let totalColors : number = 0;
    let lookUpMap : Map<string, number> = new Map<string, number> ();
    let grid: Array<number> = new Array<number>();

    PNG.decode('./map.png', function(pixels: Array<number>) : void {
       for (let i : number = 0; i < pixels.length; i+=4) {
           let r: number  = pixels[i];
           let g: number = pixels[i+1];
           let b: number = pixels[i+2];
           let a: number = pixels[1+3];

            let color : string = RGBtoHex(r,g,b);

            if (!lookUpMap.has(color)) {
                lookUpMap.set(color, totalColors);
                totalColors++;
            }

            let translation: number = lookUpMap.get(color);
            grid.push(translation);

           totalPixels++;
       }

        fs.writeFileSync("map.txt", JSON.stringify(grid));

        console.log(totalPixels);
    });



})();


function RGBtoHex(red: number, green: number, blue: number): string {

    try {
        return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    } catch (e) {
        return "#ffffff";
    }
}

function componentToHex(c: number) {
    let hex: string = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
