import { System } from "../../system"
import { JobSystem, ECS, idKey } from "@eix/core"
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
                if (!!tree.health.data) tree.health = tree.health.data
                if (tree.health <= 0) {
                    console.log('oof')
                    ded = true
                    // TODO
                    //@ts-ignore
                    loadScene("menu")
                }
            }
        }
    })
}