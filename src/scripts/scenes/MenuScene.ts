import { html, render } from "lit-html"
import { Scene, ScenePortal, SceneOptions, sceneData } from "@eix/ui"

@Scene({
    template: (target: any) => html`
        <h1>LD44 game</h1>
        <p>ye</p>
        <a onclick='loadScene("game")'>playyy</a>
    `,
    render,
    name: "menu",
    plugins: [{
        events: {
            start: (val: boolean, data: sceneData) => {
                data.instance.started = true
                data.parent.style.display = "block"
            },
            stop: (val: boolean, data: sceneData) => {
                data.instance.started = false
                data.parent.style.display = "none"
            }
        }
    }]
})
export class MenuScene {
    @ScenePortal<boolean>()
    started: boolean //curently if i dont add any portals it wont render, will fix tomorrow

    constructor() { }
}