import { System } from "../system"
import { ECS } from "@eix/core";
import { vec2 } from "gl-matrix";

export const Background: System = (jobSystem) => {
    jobSystem.tasks.start.addJob("background", (ecs: ECS) => {
        return (_e: any) => {
            const background = new Image()
            background.src = require("../../../../../img/bg/bg.png")
            ecs.addEntityFlowGroup()
                .addComponent("sprite", { image: background })
                .addComponent("position", vec2.fromValues(0, 0))
                .addComponent("rotation", 0)
                .addComponent("scale", vec2.fromValues(600, 400))
        }
    })
}