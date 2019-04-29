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
    template: ({ health }: any) => html`
        <span id=health>${health}%</span>
        <canvas id=canvas width=1920 height=1080>git gud browser lul</canvas>
    `,
    render,
    name: "game",
    plugins: [{
        events: {
            start: (_val, data) => {
                data.instance.started = true
                const tis: GameScene = data.instance
                // reset health
                tis.health = 100
                // create ECS and job system
                tis.ecs = new ECS()
                tis.jobSystem = new JobSystem()
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
                // update health on update
                tis.jobSystem.tasks.update.addJob("updateHealth", (ecs: ECS) => {
                    let oldHealth = tis.health
                    const treeTracker = ecs.all.has('tree').get('health')
                    return (_delta: number) => {
                        let health = treeTracker.tracked[0].health
                        if (health != oldHealth) {
                            if (typeof health == "object")
                                tis.health = health.data
                            else
                                tis.health = health.toString()
                        }
                    }
                })
                // add rendering jobs
                tis.jobSystem.tasks.draw.addJob("drawableRenderer", drawableRenderer)
                // start main loop
                MainLoop
                    .setUpdate((delta) => tis.jobSystem.tasks.update.runJobs(delta))
                    .setDraw(() => {
                        tis.jobSystem.tasks.draw.runJobs(null)
                        tis.canvasRenderer.clear()
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
    @ScenePortal<number>()
    health: number = 100

    jobSystem: JobSystem
    ecs: ECS
    canvasRenderer: CanvasRenderer
    defaultArgs = {
        canvasWidth: 600,
        canvasHeight: 400
    }
}