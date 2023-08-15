import {GameEntity} from "./gameEntity";

export interface GameSystem {
    processEntity(gameEntity: GameEntity): void;
}

export function processComponents(expects: Array<string>, removes: Array<string> = null) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function (gameEntity: GameEntity) {

            if (gameEntity.hasComponents(expects)) {
                original.call(this, gameEntity);

                if (removes != null) {
                    gameEntity.removeComponents(removes);
                }

            }
        }
    }

}
