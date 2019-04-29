import { System } from "../../system"
import { JobSystem, ECS } from "@eix/core"
import { ComponentTracker } from "@eix/core/dist/ecs/componentTracker"

export const Tree: System = (jobSystem: JobSystem) => {
    let treeTracker: ComponentTracker
    let ded: boolean = false

    jobSystem.tasks.start.addJob("tree", (ecs: ECS) => {
        return () => {
            treeTracker = ecs.addEntityFlowGroup()
                .addComponent("tree")
                .addComponent("health", 100)
                .get("tree", "health")
        }
    })
    jobSystem.tasks.update.addJob("tree", (ecs: ECS) => {
        return () => {
            if (!ded) {
                const tree = treeTracker.tracked[0]
                while (!!tree.health.data) tree.health = tree.health.data
                if (tree.health <= 0 || (typeof tree.health == "object" && "data" in tree.health)) {
                    console.log('oof')
                    ded = true
                }
            }
            if (ded) {
                // TODO
                //@ts-ignore
                loadScene("gameover")
            }
        }
    })
}