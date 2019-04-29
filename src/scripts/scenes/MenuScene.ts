import { html, render } from "lit-html"
import { Scene, ScenePortal, SceneOptions, sceneData, SceneManager } from "@eix/ui"

@Scene({
    template: (_target: any) => html`
        <div class="gameName">
            <span class="pink">100</span>
            <span class="yellow">leaves</span>
        </div>
        <div class="menuButtons">
            <div class="menuButton" @click="${() => _target.play()}">play</div> 
            <div class="menuButton">credits</div>
        </div>
    `,
    render,
    name: "menu",
    plugins: [{
        events: {
            start: (_val: boolean, data: sceneData) => {
                data.instance.started = true
                data.parent.style.display = "flex"
            },
            stop: (_val: boolean, data: sceneData) => {
                data.instance.started = false
                data.parent.style.display = "none"
            }
        }
    }]
})
export class MenuScene {
    @ScenePortal<boolean>()
    started: boolean

    constructor() { }

    play() { 
        //@ts-ignore
        window.loadScene("game")
    }
}