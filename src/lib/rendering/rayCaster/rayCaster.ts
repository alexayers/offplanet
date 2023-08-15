import {Camera} from "@lib/rendering/rayCaster/camera";
import {Renderer} from "@lib/rendering/renderer";
import {Color} from "@lib/primatives/color";
import {TransparentWall} from "@lib/rendering/rayCaster/transparentWall";
import {DoorState, World} from "@lib/rendering/rayCaster/world";
import {Sprite} from "@lib/rendering/sprite";
import {GameEntityRegistry} from "@lib/registries/gameEntityRegistry";
import {GameEntity} from "@lib/ecs/gameEntity";
import {SpriteComponent} from "@lib/ecs/components/spriteComponent";
import {PositionComponent} from "@lib/ecs/components/positionComponent";
import {DistanceComponent} from "@lib/ecs/components/distanceComponent";
import {AnimatedSpriteComponent} from "@lib/ecs/components/animatedSpriteComponent";
import {DamagedComponent} from "@lib/ecs/components/damagedComponent";


export class RayCaster {

    private _cameraXCoords: Array<number> = [];
    private _zBuffer: Array<number> = [];
    private _tpWalls = [];


    constructor() {
        for (let x: number = 0; x < Renderer.getCanvasWidth(); x++) {
            let cameraX: number = 2 * x / Renderer.getCanvasWidth() - 1;
            this._cameraXCoords.push(cameraX);
        }
    }

    drawWall(camera: Camera, x: number): void {

        let worldMap: World = World.getInstance();
        let rayDirX: number = camera.xDir + camera.xPlane * this._cameraXCoords[x];
        let rayDirY: number = camera.yDir + camera.yPlane * this._cameraXCoords[x];
        let mapX: number = Math.floor(camera.xPos);
        let mapY: number = Math.floor(camera.yPos);
        let sideDistX: number;
        let sideDistY: number;
        let deltaDistX: number = Math.abs(1 / rayDirX);
        let deltaDistY: number = Math.abs(1 / rayDirY);
        let perpWallDist: number;
        let stepX: number;
        let stepY: number;
        let hit: number = 0;
        let side: number;
        let wallXOffset: number = 0;
        let wallYOffset: number = 0;
        let wallX: number;
        let rayTex: number;
        let gameEntity: GameEntity;

        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (camera.xPos - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - camera.xPos) * deltaDistX;
        }
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (camera.yPos - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - camera.yPos) * deltaDistY;
        }

        while (hit == 0) {

            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }

            gameEntity = worldMap.getPosition(mapX, mapY);

            if (!gameEntity.hasComponent("floor")) {
                if (gameEntity.hasComponent("door") && worldMap.getDoorState(mapX, mapY) != DoorState.OPEN) {
                    hit = 1;
                    if (side == 1) {
                        wallYOffset = 0.5 * stepY;
                        perpWallDist = (mapY - camera.yPos + wallYOffset + (1 - stepY) / 2) / rayDirY;
                        wallX = camera.xPos + perpWallDist * rayDirX;
                        wallX -= Math.floor(wallX);
                        if (sideDistY - (deltaDistY / 2) < sideDistX) {
                            if (1.0 - wallX <= worldMap.getDoorOffset(mapX, mapY)) {
                                hit = 0;
                                wallYOffset = 0;
                            }
                        } else {
                            mapX += stepX;
                            side = 0;
                            rayTex = 4;
                            wallYOffset = 0;
                        }
                    } else {
                        wallXOffset = 0.5 * stepX;
                        perpWallDist = (mapX - camera.xPos + wallXOffset + (1 - stepX) / 2) / rayDirX;
                        wallX = camera.yPos + perpWallDist * rayDirY;
                        wallX -= Math.floor(wallX);
                        if (sideDistX - (deltaDistX / 2) < sideDistY) {
                            if (1.0 - wallX < worldMap.getDoorOffset(mapX, mapY)) {
                                hit = 0;
                                wallXOffset = 0;
                            }
                        } else {
                            mapY += stepY;
                            side = 1;
                            rayTex = 4;
                            wallXOffset = 0;
                        }
                    }
                } else if (gameEntity.hasComponent("pushWall") && worldMap.getDoorState(mapX, mapY) != DoorState.OPEN) {
                    if (side == 1 && sideDistY - (deltaDistY * (1 - worldMap.getDoorOffset(mapX, mapY))) < sideDistX) {
                        hit = 1;
                        wallYOffset = worldMap.getDoorOffset(mapX, mapY) * stepY;
                    } else if (side == 0 && sideDistX - (deltaDistX * (1 - worldMap.getDoorOffset(mapX, mapY))) < sideDistY) {
                        hit = 1;
                        wallXOffset = worldMap.getDoorOffset(mapX, mapY) * stepX;
                    }
                } else if (gameEntity.hasComponent("transparentWall")) {
                    if (side == 1) {
                        if (sideDistY - (deltaDistY / 2) < sideDistX) {
                            let wallDefined: boolean = false;
                            for (let i: number = 0; i < this._tpWalls.length; i++) {
                                if (this._tpWalls[i].mapX == mapX && this._tpWalls[i].mapY == mapY) {
                                    this._tpWalls[i].screenX.push(x);
                                    wallDefined = true;
                                    break;
                                }
                            }
                            if (!wallDefined) {
                                let tpWall: TransparentWall = new TransparentWall(camera, mapX, mapY, side, x, this._cameraXCoords);
                                this._tpWalls.push(tpWall);
                            }
                        }
                    } else {
                        if (sideDistX - (deltaDistX / 2) < sideDistY) {
                            let wallDefined: boolean = false;
                            for (let i: number = 0; i < this._tpWalls.length; i++) {
                                if (this._tpWalls[i].mapX == mapX && this._tpWalls[i].mapY == mapY) {
                                    this._tpWalls[i].screenX.push(x);
                                    wallDefined = true;
                                    break;
                                }
                            }
                            if (!wallDefined) {
                                let tpWall: TransparentWall = new TransparentWall(camera, mapX, mapY, side, x, this._cameraXCoords);
                                this._tpWalls.push(tpWall);
                            }
                        }
                    }
                } else if (!gameEntity.hasComponent("door") && !gameEntity.hasComponent("pushWall")) {

                    let adjacentGameEntityUp: GameEntity = worldMap.getPosition(mapX, mapY - stepY);
                    let adjacentGameEntityAcross: GameEntity = worldMap.getPosition(mapX - stepX, mapY)

                    if (side == 1 && adjacentGameEntityUp.hasComponent("door")) {
                        rayTex = 4;
                    } else if (side == 0 && adjacentGameEntityAcross.hasComponent("door")) {
                        rayTex = 4;
                    }

                    hit = 1;
                }
            }
        }

        perpWallDist = this.calculatePerpWall(side, mapX, mapY, camera, wallXOffset, wallYOffset, stepX, stepY, rayDirX, rayDirY);

        let lineHeight: number = Math.round(Renderer.getCanvasHeight() / perpWallDist);
        let drawStart: number = -lineHeight / 2 + Math.round(Renderer.getCanvasHeight() / 2);

        if (side == 0) {
            wallX = camera.yPos + perpWallDist * rayDirY;
        } else if (side == 1 || side == 2) {
            wallX = camera.xPos + perpWallDist * rayDirX;
        }

        wallX -= Math.floor(wallX);

        if (gameEntity.hasComponent("door")) {
            wallX += worldMap.getDoorOffset(mapX, mapY);
        }

        // Swap texture out for door frame
        if (rayTex == 4) {
            gameEntity = GameEntityRegistry.getInstance().getSingleton("doorFrame");
        }


        let sprite: SpriteComponent;
        let wallTex: Sprite;

        if (gameEntity.hasComponent("sprite")) {
            sprite = gameEntity.getComponent("sprite") as SpriteComponent
            wallTex = sprite.sprite;
        } else if (gameEntity.hasComponent("animatedSprite")) {
            let animatedSprite: AnimatedSpriteComponent = gameEntity.getComponent("animatedSprite") as AnimatedSpriteComponent;
            wallTex = animatedSprite.animatedSprite.currentSprite();
        }

        let texX: number = Math.floor(wallX * wallTex.image.width);
        if (side == 0 && rayDirX > 0) {
            texX = wallTex.image.width - texX - 1;
        } else if (side == 1 && rayDirY < 0) {
            texX = wallTex.image.width - texX - 1;
        }

        Renderer.renderClippedImage(wallTex.image, texX, 0, 1, wallTex.image.height, x, drawStart, 1, lineHeight);

        if (gameEntity.hasComponent("damaged")) {
            let damaged: DamagedComponent = gameEntity.getComponent("damaged") as DamagedComponent;

            Renderer.setAlpha(damaged.damage / 100);
            Renderer.renderClippedImage(damaged.damageSprite.image, texX, 0, 1, wallTex.image.height, x, drawStart, 1, lineHeight);
        }


        this.renderShadows(perpWallDist, x, drawStart, lineHeight);

        this._zBuffer[x] = perpWallDist;
    }

    renderShadows(perpWallDist: number, x: number, drawStart: number, lineHeight: number): void {
        let lightRange: number = World.getInstance().getWorldMap().lightRange;
        let calculatedAlpha: number = Math.max((perpWallDist + 0.002) / lightRange, 0);

        if (calculatedAlpha > 0.9) {
            calculatedAlpha = 0.9;
        }
        Renderer.rect(
            x | 0, drawStart | 0, 1, lineHeight + 1, new Color(0, 0, 0, calculatedAlpha)
        );
    }

    calculatePerpWall(side: number, mapX: number, mapY: number, camera: Camera, wallXOffset: number, wallYOffset: number, stepX: number, stepY: number, rayDirX: number, rayDirY: number) {
        let perpWallDist: number = 0;

        if (side == 0) {
            perpWallDist = (mapX - camera.xPos + wallXOffset + (1 - stepX) / 2) / rayDirX;
        } else if (side == 1) {
            perpWallDist = (mapY - camera.yPos + wallYOffset + (1 - stepY) / 2) / rayDirY;
        }

        return perpWallDist;
    }

    drawSpritesAndTransparentWalls(camera: Camera): void {

        let spriteDistance: Array<number> = [];
        let order: Array<number> = [];
        let gameEntities: Array<GameEntity> = World.getInstance().getWorldMap().items;
        let sprites: Array<Sprite> = [];

        if (gameEntities == null) {
            return;
        }

        for (let i: number = 0; i < gameEntities.length; i++) {
            order[i] = i;

            let gameEntity: GameEntity = gameEntities[i];
            let sprite: SpriteComponent;

            if (gameEntity.hasComponent("sprite")) {
                sprite = gameEntity.getComponent("sprite") as SpriteComponent;
            } else if (gameEntity.hasComponent("animatedSprite")) {
                let animatedSprite: AnimatedSpriteComponent = gameEntity.getComponent("animatedSprite") as AnimatedSpriteComponent;
                sprite = new SpriteComponent(animatedSprite.animatedSprite.currentSprite());
            }

            let position: PositionComponent = gameEntity.getComponent("position") as PositionComponent;
            spriteDistance[i] = ((camera.xPos - position.x) * (camera.xPos - position.x)) + ((camera.yPos - position.y) * (camera.yPos - position.y));


            let distance: DistanceComponent = gameEntity.getComponent("distance") as DistanceComponent;

            distance.distance = spriteDistance[i];

            sprite.sprite.x = position.x;
            sprite.sprite.y = position.y;

            sprites.push(sprite.sprite);
        }

        this.combSort(order, spriteDistance);

        let tp: number = -1;
        if (this._tpWalls.length > 0) {
            tp = this._tpWalls.length - 1;
        }

        for (let i: number = 0; i < sprites.length; i++) {

            let spriteX: number = sprites[order[i]].x - camera.xPos;
            let spriteY: number = sprites[order[i]].y - camera.yPos;

            let invDet: number = 1.0 / (camera.xPlane * camera.yDir - camera.xDir * camera.yPlane);
            let transformX: number = invDet * (camera.yDir * spriteX - camera.xDir * spriteY);
            let transformY: number = invDet * (-camera.yPlane * spriteX + camera.xPlane * spriteY);

            if (transformY > 0) {
                for (tp; tp >= 0; tp--) {
                    let tpDist: number = ((camera.xPos - this._tpWalls[tp].mapX) * (camera.xPos - this._tpWalls[tp].mapX)) + ((camera.yPos - this._tpWalls[tp].mapY) * (camera.yPos - this._tpWalls[tp].mapY));
                    if (spriteDistance[i] < tpDist) {
                        this._tpWalls[tp].draw();
                    } else {
                        break;
                    }
                }

                let spriteHeight: number = Math.abs(Math.floor(Renderer.getCanvasHeight() / transformY));
                let drawStartY: number = -spriteHeight / 2 + Math.round(Renderer.getCanvasHeight() / 2);

                let spriteScreenX: number = Math.floor(Renderer.getCanvasWidth() / 2) * (1 + transformX / transformY);
                let spriteWidth: number = Math.abs(Math.floor(Renderer.getCanvasHeight() / transformY));
                let drawStartX: number = Math.floor(-spriteWidth / 2 + spriteScreenX);
                let drawEndX: number = drawStartX + spriteWidth;

                let clipStartX: number = drawStartX;
                let clipEndX: number = drawEndX;

                if (drawStartX < -spriteWidth) {
                    drawStartX = -spriteWidth;
                }
                if (drawEndX > Renderer.getCanvasWidth() + spriteWidth) {
                    drawEndX = Renderer.getCanvasWidth() + spriteWidth;
                }

                for (let stripe: number = drawStartX; stripe <= drawEndX; stripe++) {
                    if (transformY > this._zBuffer[stripe]) {
                        if (stripe - clipStartX <= 1) {
                            clipStartX = stripe;
                        } else {
                            clipEndX = stripe;
                            break;
                        }
                    }
                }

                if (clipStartX != clipEndX && clipStartX < Renderer.getCanvasWidth() && clipEndX > 0) {
                    let scaleDelta: number = sprites[order[i]].width / spriteWidth;
                    let drawXStart: number = Math.floor((clipStartX - drawStartX) * scaleDelta);
                    if (drawXStart < 0) {
                        drawXStart = 0;
                    }
                    let drawXEnd: number = Math.floor((clipEndX - clipStartX) * scaleDelta) + 1;
                    if (drawXEnd > sprites[order[i]].width) {
                        drawEndX = sprites[order[i]].width;
                    }

                    let drawWidth: number = clipEndX - clipStartX;
                    if (drawWidth < 0) {
                        drawWidth = 0;
                    }

                    let drawAng: number = Math.atan2(spriteY, spriteX);
                    //  sprites[order[i]].updateSpriteRotation(drawAng);


                    Renderer.saveContext();
                    Renderer.disableImageSmoothing()

                    Renderer.renderClippedImage(sprites[order[i]].image, drawXStart, 0, drawXEnd, sprites[order[i]].height, clipStartX, drawStartY, drawWidth, spriteHeight);

                    Renderer.restoreContext();
                }
            }
        }

        for (tp; tp >= 0; tp--) {
            this._tpWalls[tp].draw();
        }
        this._tpWalls.length = 0;
    }

    drawSkyBox(): void {

        if (World.getInstance().getWorldMap().skyBox) {
            Renderer.renderImage(World.getInstance().getWorldMap().skyBox.image, 0, 0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight());
        } else {
            // Sky
            Renderer.rect(0, 0, Renderer.getCanvasWidth(), Renderer.getCanvasHeight() / 2, World.getInstance().getWorldMap().skyColor);

        }

        // Ground
        Renderer.rect(0, Renderer.getCanvasHeight() / 2, Renderer.getCanvasWidth(), Renderer.getCanvasHeight(), World.getInstance().getWorldMap().floorColor);
    }

    combSort(order: Array<number>, dist: Array<number>): void {

        let amount: number = order.length;
        let gap: number = amount;
        let swapped: boolean = false;

        while (gap > 1 || swapped) {

            gap = Math.floor((gap * 10) / 13);
            if (gap == 9 || gap == 10) {
                gap = 11;
            }
            if (gap < 1) {
                gap = 1;
            }
            swapped = false;
            for (let i: number = 0; i < amount - gap; i++) {
                let j: number = i + gap;

                if (dist[i] < dist[j]) {
                    [dist[i], dist[j]] = [dist[j], dist[i]];
                    [order[i], order[j]] = [order[j], order[i]];
                    swapped = true;
                }
            }
        }
    }
}
