import { ECS, JobSystem } from "@eix/core"
import { Scene, ScenePortal } from "@eix/ui"
import { html, TemplateResult, render } from 'lit-html'
import { CanvasRenderer, drawableRenderer } from "@eix/gfx"
import * as MainLoop from "mainloop.js"
import { systems } from "./systems"
import { opacityPlugin } from "../../plugins/opacity";
import { zindex } from "../../plugins/zindex";
import { loadAudio } from "../../../scripts/loadStuff";


/**
 * the menu scene
 */
@Scene({
    template: ({ health, score }: any) => html`
        <span id=health>Hp:${health}% <br> Score: ${score}</span>
        <canvas id=canvas width=1920 height=1080>git gud browser lul</canvas>
    `,
    render,
    name: "game",
    plugins: [zindex, opacityPlugin, {
        events: {
            start: (_val, data) => {
                //@ts-ignore
                window.e()
                data.instance.started = true
                const tis: GameScene = data.instance
                // reset health
                tis.health = 1000
                // create ECS and job system
                tis.ecs = new ECS()
                tis.jobSystem = new JobSystem()

                //create game manager
                tis.ecs
                    .addEntityFlowGroup()
                    .addComponent("manager", {
                        points: 0
                    })

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

                data.instance.opacity = 1

                //music
                tis.music.play()
            },
            stop: (_val, data) => {
                data.instance.started = false
                const tis: GameScene = data.instance
                // stop systems
                tis.jobSystem.tasks.stop.runJobs(null)
                // stop main loop
                MainLoop.stop()
                data.instance.opacity = 0

                //music
                tis.music.pause()
            }
        }
    }]
})
export class GameScene {
    @ScenePortal<number>()
    health: number = 100

    //opacity plugin
    @ScenePortal<number>()
    opacity = 0
    opacitySmoothness = 30
    defaultDisplay = "block"

    jobSystem: JobSystem
    ecs: ECS
    canvasRenderer: CanvasRenderer
    defaultArgs = {
        canvasWidth: 600,
        canvasHeight: 400
    }

    music = loadAudio(require("../../../../audio/main.ogg"))

    get score() {
        try {
            return this.ecs.all.has("manager").get("manager").tracked[0].manager.points
        }
        catch (err) {
            return 0
        }
    }
}