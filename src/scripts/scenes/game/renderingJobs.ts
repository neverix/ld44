import { Task } from "@eix/core/dist/jobSystem/task"
import { ECS } from "@eix/core"
import { Renderer } from "@eix/gfx/dist/Renderer"
import { spriteRenderingJob } from "@eix/gfx"

export function addRenderingJobs(task: Task<[ECS, Renderer], []>) {
    task.addJob("spriteRenderer", spriteRenderingJob)
}