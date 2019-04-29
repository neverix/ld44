import { System } from "../../system";
import { ECS, JobSystem } from "@eix/core";
import { KeyboardInput } from "@eix/input"
import { vec2 } from "gl-matrix";
import { ComponentTracker } from "@eix/core/dist/ecs/componentTracker";

const numberOfBranches = 3

export const Branches: System = (jobSystem: JobSystem) => {
    let currentBranch: number = 0

    const numberKeys = []
    for (let i = 0; i < numberOfBranches; i++) {
        //@ts-ignore
        const keyboardInput = new KeyboardInput((i + 1).toString())
        keyboardInput.valueChanges.subscribe((value: boolean) => {
            console.log(i)
            if (value) {
                currentBranch = i
            }
        })
        numberKeys.push(keyboardInput)
    }

    const leftKey = new KeyboardInput("left")
    const rightKey = new KeyboardInput("right")
    const downKey = new KeyboardInput("down")
    const upKey = new KeyboardInput("up")

    const branches: ComponentTracker[] = []

    jobSystem.tasks.start.addJob("branches", (ecs: ECS) => {
        return (_e) => {
            const branchImage = new Image()
            branchImage.src = require("../../../../../../img/branch/branch.png")
            branchImage.onload = () => {
                for (let i = 0; i < numberOfBranches; i++) {
                    branches.push(ecs.addEntityFlowGroup()
                        .addComponent("drawable", {
                            layer: 2,
                            position: vec2.fromValues(0, 1080 / numberOfBranches * i),
                            rotation: 0,
                            scale: vec2.fromValues(branchImage.width / 3, branchImage.height / 3),
                            drawableContent: {
                                type: "sprite",
                                image: branchImage
                            }
                        })
                        .get("drawable"))
                }
            }
        }
    })

    jobSystem.tasks.update.addJob("branches", (_ecs: ECS) => {
        return (_delta: number) => {
            if (!!branches[currentBranch]) {
                const branch = branches[currentBranch].tracked[0].drawable
                if (leftKey.value) {
                    branch.rotation += 0.01
                }
                if (rightKey.value) {
                    branch.rotation -= 0.01
                }
                if (upKey.value) {
                    branch.scale[0] += 10
                }
                if (downKey.value) {
                    branch.scale[0] -= 10
                }
            }
        }
    })
}