import { System } from "../../system"
import { ECS } from "@eix/core"
import { vec2, vec3 } from "gl-matrix"
import { enemyTypes } from "./enemyType"

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
            }, 2400)
        }
    })
    jobSystem.tasks.update.addJob("spawnEnemies", (ecs: ECS) => {
        /*const rendererInfoTracker: ComponentTracker =
            ecs.all
                .has("rendererInfo")
                .get("rendererInfo")*/
        return (_delta: number) => {
            if (addEntity) {
                //const rendererInfo: RendererInfo = rendererInfoTracker.tracked[0].rendererInfo
                const enemy = ecs.addEntity()
                const size = 30
                const position = vec2.fromValues(
                    600,
                    400 - random(size, 400 / 2)
                )
                ecs.all.is(enemy)
                    .addComponent("position", position)
                    .addComponent("drawable",
                        {
                            layer: 1,
                            position,
                            scale: vec2.fromValues(size, size),
                            rotation: 0,
                            drawableContent: {
                                type: "rect",
                                color: vec3.fromValues(200, 50, 20)
                            }
                        })
                    .addComponent("enemy", enemyTypes[random(0, enemyTypes.length, true)])

                // console.log(ecs.all.is(enemy).get("positon","drawable","enemy").tracked[0].enemy)
                console.log("added entity")
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