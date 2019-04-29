import { html, render } from "lit-html"
import { Scene, ScenePortal, SceneOptions, sceneData } from "@eix/ui"

@Scene({
    template: (_target: any) => html`
        <div class="gameName">
            100 leave
        </div>
        <div class="menuButtons">
            <div class="menuButton">something else</div> 
            <div class="menuButton">play</div>
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
}