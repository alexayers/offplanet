import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {Renderer} from "@lib/rendering/renderer";
import {Fonts} from "../fonts";
import {Color} from "@lib/primatives/color";
import {GlobalState} from "@lib/application/globalState";


export class MissionRenderSystem implements GameRenderSystem {

    process(): void {


        Renderer.print(`Station Status`, 15, 70, {
            family: Fonts.Oxanium,
            size: 15,
            color: new Color(255, 255, 255, 1.0)
        });

        let offsetY: number = 90;


        if (GlobalState.getState("powerSupplyFunctional") == false) {
            Renderer.print(`- No Power`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        } else {
            Renderer.print(`- Power Levels Nominal`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        }

        offsetY += 20;

        if (GlobalState.getState("powerSupplyFunctional") == false) {
            Renderer.print(`- Air Purifier [Offline]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        } else {
            Renderer.print(`- Air Purifier [80%]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        }

        offsetY += 20;

        if (GlobalState.getState("powerSupplyFunctional") == false) {
            Renderer.print(`- Refrigerant System [Offline]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        } else {
            Renderer.print(`- Refrigerant System [70%]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        }

        offsetY += 20;

        if (GlobalState.getState("powerSupplyFunctional") == false) {
            Renderer.print(`- Waste Management [Offline]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        } else {
            Renderer.print(`- Waste Management [20%]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        }

        offsetY += 20;

        if (GlobalState.getState("powerSupplyFunctional") == false) {
            Renderer.print(`- Moisture Extractors [Offline]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        } else {
            Renderer.print(`- Moisture Extractors [90%]`, 30, offsetY, {
                family: Fonts.Oxanium,
                size: 12,
                color: new Color(255, 255, 255, 1.0)
            });
        }



    }




}
