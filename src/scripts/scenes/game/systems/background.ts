import { System } from "../system"
import { ECS } from "@eix/core";
import { vec2 } from "gl-matrix";

export const Background: System = (jobSystem) => {
    jobSystem.tasks.start.addJob("background", (ecs: ECS) => {
        return (_e: any) => {
            const background = new Image()
            background.src = require("../../../../../img/forestbg.jpg")
            const id = ecs.addEntity()
            ecs.all.is(id)
                .pipe((ids: number[], ecs: ECS) => {
                    ids.forEach(id => {
                        ecs.entities[id]["pos"] = 'e'
                    })
                    return ids
                })
                .addComponent("sprite", { image: background })
                .addComponent("position", vec2.fromValues(0, 0))
                .addComponent("rotation", 0.5)
                .addComponent("scale", vec2.fromValues(background.width, background.height))
                .get()
        }
    })
}