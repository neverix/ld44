import { System } from "../../system";
import { ECS, JobSystem, idKey } from "@eix/core";
import { KeyboardInput } from "@eix/input"
import { vec2, vec3 } from "gl-matrix";
import { ComponentTracker } from "@eix/core/dist/ecs/componentTracker";
import { start } from "repl";

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
    const space = new KeyboardInput("space")

    const branches: [ComponentTracker, ComponentTracker][] = []
    const startPositions: vec2[] = []

    const branchImage = new Image()
    const branchImage2 = new Image()

    jobSystem.tasks.start.addJob("branches", (ecs: ECS) => {
        return (_e) => {
            branchImage.src = require("../../../../../../img/branch/branch.png")
            branchImage2.src = require("../../../../../../img/branch/branch2.png")
            branchImage.onload = () => {
                for (let i = 0; i < numberOfBranches; i++) {
                    const startPosition = vec2.fromValues(100, 1080 / numberOfBranches * i)
                    startPositions.push(startPosition)
                    branches.push([
                        ecs.addEntityFlowGroup()
                            .addComponent("drawable", {
                                layer: 2,
                                position: startPosition,
                                rotation: 0,
                                scale: vec2.fromValues(branchImage.width / 3, branchImage.height / 3),
                                drawableContent: {
                                    type: "sprite",
                                    image: branchImage
                                }
                            })
                            .get("drawable"),
                        ecs.addEntityFlowGroup()
                            .addComponent("drawable", {
                                layer: 2,
                                position: startPosition,
                                rotation: 0,
                                scale: vec2.fromValues(branchImage2.width / 3, branchImage2.height / 3),
                                drawableContent: {
                                    type: "sprite",
                                    image: branchImage2
                                }
                            })
                            .get("drawable")])
                }
            }
        }
    })

    jobSystem.tasks.update.addJob("branches", (ecs: ECS) => {
        return (_delta: number) => {
            if (!!branches[currentBranch]) {
                branches.forEach((branchez: any, index) => {
                    const branch1 = branchez[0].tracked[0].drawable
                    const branch2 = branchez[1].tracked[0].drawable

                    if (index == currentBranch) {
                        if (leftKey.value) {
                            branch1.rotation += 0.01
                        }
                        if (rightKey.value) {
                            branch1.rotation -= 0.01
                        }
                        if (upKey.value) {
                            branch1.scale[0] += 10
                        }
                        if (downKey.value) {
                            branch1.scale[0] -= 10
                        }
                    }

                    const branch2Position = vec2.add(
                        vec2.create(),
                        startPositions[index],
                        vec2.fromValues(
                            Math.cos(branch1.rotation) * branch1.scale[0],
                            Math.sin(branch1.rotation) * branch1.scale[0]))
                    branch2.position = branch2Position
                    branch2.rotation = branch1.rotation

                    if (space.value && index == currentBranch) {
                        branch1.rotation = 0
                        branch1.scale[0] = branchImage.width / 3

                        let found = false
                        ecs.all.has("enemy").get("position", "drawable").tracked.forEach(enemy => {
                            if (found) return
                            const diff = vec2.length(
                                vec2.sub(vec2.create(), branch2Position, enemy.position))
                            if (diff <= enemy.drawable.scale[1] * 4) {
                                delete ecs.entities[enemy[idKey]]
                                ecs.emit("entityDeleted", enemy[idKey])
                                found = true
                            }
                        })
                    }
                })
            }
        }
    })
}