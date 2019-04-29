import { JobSystem, ECS, idKey } from "@eix/core"
import { System } from "../../system"
// import { ComponentTracker } from "@eix/core/dist/ecs/componentTracker"

interface UpdateData {
    id: number
    key: string
    value: any
}

export const Enemy: System = (jobSystem: JobSystem) => {
    jobSystem.tasks.update.addJob("enemy", (ecs: ECS) => {
        let components = ecs.all
            .has("enemy", "position", "drawable")
            .get("enemy", "position", "drawable","mutated")

        return (delta: number) => {
            components.tracked.forEach(enemy => {
                enemy.position[0] = enemy.position[0] - enemy.mutated.speed
                if (enemy.position[0] <= 210 && enemy[idKey] in ecs.entities) {

                    const entities = ecs.entities
                    let obj: any = {}

                    for (let i in entities)
                        if (i != enemy[idKey])
                            obj[i] = entities[i]

                    ecs.entities = obj
                    ecs.emit("entityDeleted", enemy[idKey])
                    const tree = ecs.all.has("tree").get("health").tracked[0]
                    tree.health = tree.health - enemy.enemy.strength
                    // console.log(tree.health)
                }
            })
        }
    })
}