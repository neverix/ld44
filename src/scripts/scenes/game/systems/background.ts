import { System } from "../system"
import { ECS } from "@eix/core"
import { vec2 } from "gl-matrix"
import { Components } from "@eix/core/dist/ecs/interfaces"

export const Background: System = (jobSystem) => {
    let bgEntity: Components
    jobSystem.tasks.start.addJob("background", (ecs: ECS) => {
        return (_e: any) => {
            const background = new Image()
            background.src = require("../../../../../img/bg/bg.png")
            const bgID = ecs.addEntity()
            ecs.all.is(bgID)
                .addComponent("drawable", {
                    layer: -10,
                    position: vec2.fromValues(0, 0),
                    scale: vec2.fromValues(600, 400),
                    rotation: 0,
                    drawableContent: {
                        image: background,
                        type: "sprite"
                    }
                })
            bgEntity = ecs.entities[bgID]
        }
    })
}