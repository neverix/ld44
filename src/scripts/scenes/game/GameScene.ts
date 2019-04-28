import { ECS, JobSystem } from "@eix/core"
import { Scene } from "../../scene"
import { html, TemplateResult } from 'lit-html'
import { CanvasRenderer } from "@eix/gfx"
import * as MainLoop from "mainloop.js"
import { addRenderingJobs } from "./renderingJobs"
import { systems } from "./systems";

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
        const jobSystem = new JobSystem()
        // update state
        setState({ ecs, jobSystem, args })
        // create renderer
        const canvasRenderer = new CanvasRenderer(
            document.getElementById('canvas') as HTMLCanvasElement)
        // add update task
        jobSystem.addTask("update", ecs)
        // add start task
        jobSystem.addTask("start", ecs)
        // add systems
        systems.forEach(system => {
            system(jobSystem)
        })
        // run the start task
        jobSystem.tasks.start.runJobs(null)
        // add draw task
        jobSystem.addTask("draw", [ecs, canvasRenderer])
        // add rendering jobs
        addRenderingJobs(jobSystem.tasks.draw)
        // start main loop
        MainLoop
            .setUpdate((delta) => jobSystem.tasks.update.runJobs(delta))
            .setDraw(() => jobSystem.tasks.draw.runJobs(null)).start()
    }
    stop() {
        // stop main loop
        MainLoop.stop()
    }
    defaultArgs = {
        canvasWidth: 600,
        canvasHeight: 400
    }
}