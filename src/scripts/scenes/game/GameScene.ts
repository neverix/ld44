import { ECS, JobSystem } from "@eix/core"
import { Scene } from "../../scene"
import { html, TemplateResult } from 'lit-html'
import { spriteRenderingJob, CanvasRenderer } from "@eix/gfx"
import * as MainLoop from "mainloop.js"
import { vec2 } from "gl-matrix";

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
        const ecs = new ECS()
        const jobSystem = new JobSystem()
        setState({ ecs, jobSystem })
        ecs.addEntity()
        const nev = ecs.entities[0]
        const image = new Image()
        image.src = require("../../../../img/nev.png")
        nev.sprite = { image }
        nev.position = vec2.fromValues(0, 0)
        nev.rotation = 0
        nev.scale = vec2.fromValues(1, 1)
        const canvasRenderer = new CanvasRenderer(
            document.getElementById('canvas') as HTMLCanvasElement)
        jobSystem.addTask("draw", [ecs, canvasRenderer])
        jobSystem.tasks.draw.addJob("spriteRenderer", spriteRenderingJob)
        MainLoop.setDraw(() => jobSystem.tasks.draw.runJobs(null)).start()
    }
    stop() { }
    defaultArgs = {
        canvasWidth: 500,
        canvasHeight: 500
    }
}