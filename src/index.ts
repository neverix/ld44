import { ECS, JobSystem } from "@eix/core"
import { spriteRenderingJob, spriteComponent } from "@eix/gfx"
import { Portal } from "@eix/ui"
import MainLoop from "mainloop.js";

const ecs = new ECS()
const jobSystem = new JobSystem()
jobSystem.addTask("update", ecs)
jobSystem.tasks.update
    .addJob("log", (ecs) => {
        return (delta: number) => { }
    })
jobSystem.addTask("draw", ecs)

MainLoop
    .setUpdate(delta => jobSystem.tasks.update.runJobs(delta))
    .setDraw(interpolationPercentage => jobSystem.tasks.draw.runJobs(interpolationPercentage))
    .start()