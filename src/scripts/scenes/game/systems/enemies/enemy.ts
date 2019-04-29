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
        let tracked = ecs.all
            .has("enemy", "position", "drawable")
            .get("enemy", "position", "drawable")
            .tracked
        ecs.on("update", (data: UpdateData) => {
            if (data.key == "enemy") {
                tracked = ecs.all
                    .has("enemy", "position", "drawable")
                    .get("enemy", "position", "drawable")
                    .tracked
            }
        })
        ecs.on("entityDeleted", () => {
            tracked = ecs.all
                .has("enemy", "position", "drawable")
                .get("enemy", "position", "drawable")
                .tracked
        })
        return (delta: number) => {
            tracked.forEach(enemy => {
                enemy.position[0] = enemy.position[0] - enemy.enemy.speed
                enemy.drawable.position = enemy.position
                if (enemy.position[0] <= enemy.drawable.scale[0] && enemy[idKey] in ecs.entities) {
                    delete ecs.entities[enemy[idKey]]
                    ecs.emit("entityDeleted", enemy[idKey])
                    tracked = ecs.all
                        .has("enemy", "position", "drawable")
                        .get("enemy", "position", "drawable")
                        .tracked
                    console.log("boom")
                }
            })
        }
    })
}