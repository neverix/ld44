import { System } from "../../system"
import { ECS } from "@eix/core"
import { vec2, vec3 } from "gl-matrix"
import { enemyTypes } from "./enemyType"

function generateSpeed(old: number, value: number, points: number): number {
    // coefficients
    const a = 50
    const b = 30
    const c = 10
    const d = 2.5

    //a * 100 - (100 - b) * c = b * ( a - .... )

    //!big ecuation
    const result = old * ((points) ? (points * (100 - b) + b * (a - (100 - b) * c / b)) * d / 100 : a) / (value * a)

    console.log({ result, points });

    return result
}

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
    let currentTime = 2400
    const dec = 50
    const minTime = 500

    jobSystem.tasks.start.addJob("startSpawner", (ecs: ECS) => {
        return () => {
            //@ts-ignore
            interval = setInterval(() => {
                addEntity = true
            }, currentTime)
        }
    })

    // hack
    let Type = enemyTypes[0]
    //get images
    const imagesPromise = Type.images

    Promise.all(imagesPromise).then((newImgs) => {
        const images = newImgs

        jobSystem.tasks.update.addJob("spawnEnemies", (ecs: ECS) => {
            //manager
            const manager = ecs.all.has("manager").get("manager")
            console.log(manager.tracked[0].manager.points)

            /*const rendererInfoTracker: ComponentTracker =
                ecs.all
                    .has("rendererInfo")
                    .get("rendererInfo")*/
            return (_delta: number) => {
                if (addEntity) {
                    //const rendererInfo: RendererInfo = rendererInfoTracker.tracked[0].rendererInfo
                    const enemy = ecs.addEntity()
                    const size = 100
                    const position = vec2.fromValues(
                        1920,
                        1080 - random(size, 1080 * 0.4)
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
                                    type: "sprite",
                                    image: images[0]
                                }
                            })
                        .addComponent("enemy", Type)
                        .addComponent("images", images)
                        .addComponent("timer", { time: 0 })
                        .addComponent("mutated", {
                            speed: generateSpeed(Type.speed, Type.points, manager.tracked[0].manager.points)
                        }) //TODO: change name before pushing
                    clearInterval(interval)
                    if (currentTime - dec >= minTime) {
                        currentTime -= dec
                        //@ts-ignore
                        interval = setInterval(() => {
                            addEntity = true
                        }, currentTime)
                    }

                    addEntity = false
                }
            }
        })
    })

    jobSystem.tasks.stop.addJob("stopSpawner", () => {
        return () => {
            clearInterval(interval)
        }
    })
}