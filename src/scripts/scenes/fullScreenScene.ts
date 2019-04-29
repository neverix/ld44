import { Scene, ScenePortal, sceneData } from "@eix/ui";
import { html, render } from "lit-html";
import { closeFullscreen, openFullscreen } from "../fullScreen"

@Scene({
    template: (target: any) => html`
        <button @click=${()=> target.click()}>
            ${target.open}
        </button>
    `,
    render,
    name: "screen",
    plugins: [{
        events: {
            start: (val: boolean, data: sceneData) => {
                data.emitter.next()

                //manage state
                document.onfullscreenchange = () => {
                    data.instance.open = !data.instance.open
                }
            },
            stop: () => { }
        }
    }]
})
export class ScreenScene {
    @ScenePortal<boolean>()
    open = false

    click() { //is run on click
        // this.open = !this.open //switch the state

        //handle fullscreen
        if (!this.open)
            return openFullscreen()

        return closeFullscreen()
    }

    constructor() { }
}


