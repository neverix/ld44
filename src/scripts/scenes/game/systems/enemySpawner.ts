import { System } from "../system"
import { ECS } from "@eix/core"

export const EnemySpawner: System = (jobSystem) => {
    let addEntity: boolean
    let interval: number
    jobSystem.tasks.start.addJob("startSpawner", (ecs: ECS) => {
        return () => {
            //@ts-ignore
            interval = setInterval(() => {
                addEntity = true
            }, 500)
        }
    })
    jobSystem.tasks.update.addJob("spawnEnemies", (ecs: ECS) => {
        return (_delta: number) => {
            if (addEntity) {
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