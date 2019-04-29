import { html, render } from "lit-html"
import { Scene, ScenePortal, sceneData } from "@eix/ui"
import { opacityPlugin } from "../plugins/opacity";
import { zindex } from "../plugins/zindex";
import { loadAudio } from "../loadStuff";

let done = false

@Scene({
    template: (_target: any) => html`
    <div>
        <div class="gameName">You lost</div>
        <div class="menuButtons">
            <div class="menuButton" onclick='loadScene("game")'>Try again</div>
            <div class="menuButton" onclick='loadScene("menu")'>Back to menu</div>
        </div>
    </div>
    `,
    render,
    name: "gameover",
    plugins: [opacityPlugin, zindex, {
        events: {
            start: (_val: boolean, data: sceneData) => {
                if (done) return

                done = true

                console.log("entering", done)

                // data.instance.started = true
                data.instance.opacity = 1

                data.instance.audio.play()
            },
            stop: (_val: boolean, data: sceneData) => {
                // data.instance.started = false
                data.instance.opacity = 0
                data.instance.audio.pause()

                done = false
            }
        }
    }]
})
export class GameOverScene {
    @ScenePortal<boolean>()
    started: boolean

    //opacity plugin
    @ScenePortal<number>()
    opacity = 0
    opacitySmoothness = 30
    defaultDisplay = "flex"


    audio = loadAudio("/audio/sad.ogg")

    constructor() { }
}