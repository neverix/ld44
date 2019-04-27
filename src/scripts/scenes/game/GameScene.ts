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
    render(state: GameState): TemplateResult {
        return html`
            <canvas id=canvas width=500 height=500>git gud browser lul</canvas>
        `
    }
    start(args: GameArgs, setState: (state: GameState) => void) {
        // create ECS
        const ecs = new ECS()
        // create job system
        const jobSystem = new JobSystem()
        // update state
        setState({ ecs, jobSystem })
        // create renderer
        const canvasRenderer = new CanvasRenderer(
            document.getElementById('canvas') as HTMLCanvasElement)
        // add draw task
        jobSystem.addTask("draw", [ecs, canvasRenderer])
        // add rendering jobs
        addRenderingJobs(jobSystem.tasks.draw)
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
        canvasWidth: 500,
        canvasHeight: 500
    }
}