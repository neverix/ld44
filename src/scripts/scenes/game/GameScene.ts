import { ECS, JobSystem } from "@eix/core"
import { Scene, ScenePortal } from "@eix/ui"
import { html, TemplateResult, render } from 'lit-html'
import { CanvasRenderer, drawableRenderer } from "@eix/gfx"
import * as MainLoop from "mainloop.js"
import { systems } from "./systems"


/**
 * the menu scene
 */
@Scene({
    template: (target: any) => html`
        <canvas id=canvas width=600 height=400>git gud browser lul</canvas>
    `,
    render,
    name: "game",
    plugins: [{
        events: {
            start: (_val, data) => {
                data.instance.started = true
                const tis: GameScene = data.instance
                // create renderer
                tis.canvasRenderer = new CanvasRenderer(
                    document.getElementById('canvas') as HTMLCanvasElement)
                // add update task
                tis.jobSystem.addTask("update", tis.ecs)
                // add start task
                tis.jobSystem.addTask("start", tis.ecs)
                // add draw task
                tis.jobSystem.addTask("draw", [tis.ecs, tis.canvasRenderer])
                // add stop task
                tis.jobSystem.addTask("stop", null)
                // add systems
                systems.forEach(system => {
                    system(tis.jobSystem)
                })
                // run the start task
                tis.jobSystem.tasks.start.runJobs(null)
                // add rendering jobs
                tis.jobSystem.tasks.draw.addJob("drawableRenderer", drawableRenderer)
                // start main loop
                MainLoop
                    .setUpdate((delta) => tis.jobSystem.tasks.update.runJobs(delta))
                    .setDraw(() => {
                        tis.canvasRenderer.clear()
                        tis.jobSystem.tasks.draw.runJobs(null)
                        tis.canvasRenderer.draw()
                    }).start()
                data.parent.style.display = "block"
            },
            stop: (_val, data) => {
                data.instance.started = false
                const tis: GameScene = data.instance
                // stop systems
                tis.jobSystem.tasks.stop.runJobs(null)
                // stop main loop
                MainLoop.stop()
                data.parent.style.display = "none"
            }
        }
    }]
})
export class GameScene {
    @ScenePortal<boolean>()
    started: boolean = false

    jobSystem: JobSystem = new JobSystem()
    ecs: ECS = new ECS()
    canvasRenderer: CanvasRenderer
    defaultArgs = {
        canvasWidth: 600,
        canvasHeight: 400
    }
}