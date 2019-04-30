import { System } from "../../system"
import { ECS } from "@eix/core"
import { vec2 } from "gl-matrix"
import { Components } from "@eix/core/dist/ecs/interfaces"

export const Background: System = (jobSystem) => {
    let bgEntity: Components
    let fgEntity: Components
    let trunk = new Image()
    let foregroundHappy = new Image()
    let foregroundSad = new Image()

    jobSystem.tasks.start.addJob("background", (ecs: ECS) => {
        return (_e: any) => {
            const background = new Image()
            background.onload = () => {
                const bgID = ecs.addEntity()
                ecs.all.is(bgID)
                    .addComponent("drawable", {
                        layer: 0,
                        position: vec2.fromValues(0, 0),
                        scale: vec2.fromValues(1920, 1080),
                        rotation: 0,
                        drawableContent: {
                            image: background,
                            type: "sprite"
                        }
                    })
                bgEntity = ecs.entities[bgID]
            }
            background.src = require("../../../../../../img/bg/bg.png")
            trunk.onload = () => {
                ecs.addEntityFlowGroup().addComponent("drawable", {
                    layer: 3,
                    position: vec2.fromValues(0, 0),
                    scale: vec2.fromValues(1920, 1080),
                    rotation: 0,
                    drawableContent: {
                        image: trunk,
                        type: "sprite"
                    }
                })
            }
            trunk.src = require("../../../../../../img/bg/trunk.png")
            foregroundHappy.onload = () => {
                foregroundSad.onload = () => {
                    const fgID = ecs.addEntity()
                    ecs.all.is(fgID)
                        .addComponent("drawable", {
                            layer: 4,
                            position: vec2.fromValues(0, 0),
                            scale: vec2.fromValues(1920, 1080),
                            rotation: 0,
                            drawableContent: {
                                image: foregroundHappy,
                                type: "sprite"
                            }
                        })
                    fgEntity = ecs.entities[fgID]
                }
            }
            foregroundHappy.src = require("../../../../../../img/bg/trunk-happy.png")
            foregroundSad.src = require("../../../../../../img/bg/trunk-sad.png")
        }
    })

    jobSystem.tasks.update.addJob("changeFace", (ecs) => {
        let oldHealth = 100
        const treeTracker = ecs.all.has("tree").get("tree", "health")
        return (_delta: number) => {
            const tree = treeTracker.tracked[0]
            if (!!tree.health.data) tree.health = tree.health.data
            if (tree.health != oldHealth) {
                fgEntity.drawable.drawableContent.image = foregroundSad
                setTimeout(() => {
                    fgEntity.drawable.drawableContent.image = foregroundHappy
                }, 500)
                oldHealth = tree.health
            }
        }
    })
}