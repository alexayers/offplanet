import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {Particle} from "@lib/rendering/particle";
import {getRandomBetween} from "@lib/utils/mathUtils";
import {Color} from "@lib/primatives/color";
import {Renderer} from "@lib/rendering/renderer";


export class DustRenderSystem implements GameRenderSystem {

    private _particles: Array<Particle> = [];


    constructor() {

        for (let i = 0; i < 800; i++) {
            this._particles.push(this.refreshParticle(new Particle()))
        }

    }


    refreshParticle(particle: Particle): Particle {


        particle.x = getRandomBetween(0, Renderer.getCanvasWidth());
        particle.y = getRandomBetween(0, Renderer.getCanvasHeight());
        particle.width = getRandomBetween(5, 7);
        particle.height = getRandomBetween(5, 7);
        particle.color = new Color(120, 120, 120, getRandomBetween(1, 100) / 1000);
        particle.lifeSpan = getRandomBetween(80, 100);
        particle.velX = (getRandomBetween(1, 7) / 100) * -1;
        particle.velY = (getRandomBetween(1, 7) / 100) * -1;
        particle.decayRate = getRandomBetween(1, 5);

        return particle;
    }

    process(): void {

        this._particles.forEach((particle) => {

            Renderer.circle(particle.x, particle.y, particle.width, particle.color);


            particle.x += particle.velX;
            particle.y += particle.velY;
            particle.color.alpha -= 0.005;
            particle.lifeSpan -= 0.004;

            if (particle.lifeSpan < 0 || particle.color.alpha <= 0) {
                this.refreshParticle(particle);
            }

        });

    }

}
