import { System } from "../../system"
import { ECS } from "@eix/core"
import { vec2, vec3 } from "gl-matrix"
import { enemyTypes } from "./enemyType";
import { ComponentTracker } from "@eix/core/dist/ecs/componentTracker"

/**
 * generate a random value
 * @param from the lowest number (inclusive)
 * @param to the highest number (exclusive)
 * @param floor should the output be an integer?
 */
function random(from: number, to: number, floor: boolean = false): number {
    const randomValue = Math.random() * (to - from) + from
    return floor ? Math.floor(randomValue) : randomValue
}

export const EnemySpawner: System = (jobSystem) => {
    let addEntity: boolean
    let interval: number
    jobSystem.tasks.start.addJob("startSpawner", (ecs: ECS) => {
        return () => {
            //@ts-ignore
            interval = setInterval(() => {
                addEntity = true
            }, 2700)
        }
    })
    jobSystem.tasks.update.addJob("spawnEnemies", (ecs: ECS) => {
        /*const rendererInfoTracker: ComponentTracker =
            ecs.all
                .has("rendererInfo")
                .get("rendererInfo")*/
        return (_delta: number) => {
            if (addEntity) {
                console.log("added entity")
                //const rendererInfo: RendererInfo = rendererInfoTracker.tracked[0].rendererInfo
                ecs.addEntityFlowGroup()
                    .addComponent("position", vec2.fromValues(
                        600,
                        400 - random(0, 400 / 2)
                    ))
                    .addComponent("enemy", enemyTypes[random(0, enemyTypes.length, true)])
                    .addComponent("drawable",
                        {
                            layer: 1,
                            position: vec2.fromValues(
                                600,
                                random(0, 400 / 2)
                            ),
                            scale: vec2.fromValues(100, 100),
                            rotation: 0,
                            drawableContent: {
                                type: "rect",
                                color: vec3.fromValues(200, 50, 20)
                            }
                        })
                    .get()
                addEntity = false
            }
        }
    })
    jobSystem.tasks.stop.addJob("stopSpawner", () => {
        return () => {
            clearInterval(interval)
        }
    })
}