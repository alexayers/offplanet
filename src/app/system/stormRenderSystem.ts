import {GameRenderSystem} from "@lib/ecs/gameRenderSystem";
import {Particle} from "@lib/rendering/particle";
import {getRandomBetween} from "@lib/utils/mathUtils";
import {Color} from "@lib/primatives/color";
import {Renderer} from "@lib/rendering/renderer";


export class StormRenderSystem implements GameRenderSystem {

    private _particles: Array<Particle> = [];


    constructor() {

        for (let i = 0; i < 80; i++) {
            this._particles.push(this.refreshParticle(new Particle()))
        }

    }


    refreshParticle(particle: Particle): Particle {


        particle.x = getRandomBetween(0, Renderer.getCanvasWidth());
        particle.y = getRandomBetween(0, Renderer.getCanvasHeight());
        particle.width = getRandomBetween(25, 500);
        particle.height = getRandomBetween(25, 900);
        particle.color = new Color(92, 55, 43, getRandomBetween(1, 100) / 1000);
        particle.lifeSpan = getRandomBetween(80, 100);
        particle.velX = getRandomBetween(1, 100) / 10;
        particle.velY = getRandomBetween(1, 100) / 100;
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
