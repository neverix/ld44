import { html, render } from "lit-html"
import { Scene, ScenePortal, sceneData } from "@eix/ui"

@Scene({
    template: (_target: any) => html`
        <h1>You lost</h1>
        <a onclick='loadScene("game")'>Try again</a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a onclick='loadScene("menu")'>Back to menu</a>
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
export class GameOverScene {
    @ScenePortal<boolean>()
    started: boolean

    constructor() { }
}