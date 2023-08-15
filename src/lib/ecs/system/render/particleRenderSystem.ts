import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {Particle} from "@lib/rendering/particle";


export class ParticleRenderSystem implements GameRenderSystem {

    private _particles: Array<Particle> = [];


    process(): void {


    }

}
