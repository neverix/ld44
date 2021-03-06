import { html, render } from "lit-html"
import { Scene, ScenePortal, SceneOptions, sceneData, SceneManager } from "@eix/ui"
import { opacityPlugin } from "../plugins/opacity";
import { zindex } from "../plugins/zindex";
import { loadAudio } from "../loadStuff";

@Scene({
    template: (_target: any) => html`
        <div>
            <div class="gameName">
                <span class="pink">100</span>
                <span class="yellow">leaves</span>
            </div>
            <div class="menuButtons">
                <div class="menuButton" @click="${() => _target.play()}">play</div>
                <div class="menuButton">credits</div>
            </div>
        </div>
    `,
    render,
    name: "menu",
    plugins: [zindex, opacityPlugin, {
        events: {
            start: (_val: boolean, data: sceneData) => {
                // data.instance.started = true
                data.instance.opacity = 1

                //@ts-ignore
                window.e = () => {
                    data.instance.music.pause()
                }

                let moved = false
                document.body.onmousemove = () => {
                    if (!moved) {
                        data.instance.music.play()
                        moved = true
                    }
                }

                console.log("started")
            },
            stop: (_val: boolean, data: sceneData) => {
                // data.instance.started = false
                data.instance.opacity = 0
            }
        }
    }]
})
export class MenuScene {
    @ScenePortal<boolean>()
    started: boolean

    //opacity plugin
    @ScenePortal<number>()
    opacity = 0
    opacitySmoothness = 30
    defaultDisplay = "flex"

    music = loadAudio(require("../../../audio/menu.ogg"))

    constructor() { }

    play() {
        //@ts-ignore
        window.loadScene("story")
        this.opacity = 0
    }
}