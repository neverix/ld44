import { html, render } from "lit-html"
import { Scene, ScenePortal, SceneOptions, sceneData } from "@eix/ui"

@Scene({
    template: (_target: any) => html`
        <h1>LD44 game</h1>
        <p>ye</p>
        <a onclick='loadScene("game")'>playyy</a>
    `,
    render,
    name: "menu",
    plugins: [{
        events: {
            start: (_val: boolean, data: sceneData) => {
                data.instance.started = true
                data.parent.style.display = "block"
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