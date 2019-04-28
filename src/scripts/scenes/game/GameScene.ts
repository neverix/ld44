import { ECS, JobSystem } from "@eix/core"
import { Scene } from "../../scene"
import { html, TemplateResult } from 'lit-html'
import { CanvasRenderer, drawableRenderer } from "@eix/gfx"
import * as MainLoop from "mainloop.js"
import { systems } from "./systems"

/**
 * state for the menu
 */
interface GameState {
    ecs: ECS
    jobSystem: JobSystem
    args: GameArgs
}

/**
 * arguments for loading the menu
 */
interface GameArgs {
    canvasWidth: number
    canvasHeight: number
}

/**
 * the menu scene
 */
export class GameScene implements Scene<GameState, GameArgs> {
    name: string = "game"
    jobSystem: JobSystem
    render(state: { state: GameState }): TemplateResult {
        const { canvasWidth, canvasHeight } = state.state.args
        return html`
            <canvas id=canvas width=${canvasWidth} height=${canvasHeight}>git gud browser lul</canvas>
        `
    }
    start(args: GameArgs, setState: (state: GameState) => void) {
        // create ECS
        const ecs = new ECS()
        // create job system
        this.jobSystem = new JobSystem()
        // update state
        setState({ ecs, jobSystem: this.jobSystem, args })
        // create renderer
        const canvasRenderer = new CanvasRenderer(
            document.getElementById('canvas') as HTMLCanvasElement)
        // add update task
        this.jobSystem.addTask("update", ecs)
        // add start task
        this.jobSystem.addTask("start", ecs)
        // add systems
        systems.forEach(system => {
            system(this.jobSystem)
        })
        // run the start task
        this.jobSystem.tasks.start.runJobs(null)
        // add draw task
        this.jobSystem.addTask("draw", [ecs, canvasRenderer])
        // add rendering jobs
        this.jobSystem.tasks.draw.addJob("drawableRenderer", drawableRenderer)
        // start main loop
        MainLoop
            .setUpdate((delta) => this.jobSystem.tasks.update.runJobs(delta))
            .setDraw(() => {
                canvasRenderer.clear()
                this.jobSystem.tasks.draw.runJobs(null)
                canvasRenderer.draw()
            }).start()
    }
    stop() {
        // stop systems
        this.jobSystem.tasks.stop.runJobs(null)
        // stop main loop
        MainLoop.stop()
    }
    defaultArgs = {
        canvasWidth: 600,
        canvasHeight: 400
    }
}