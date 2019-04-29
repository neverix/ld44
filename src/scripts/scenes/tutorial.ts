import { html, render } from "lit-html"
import { Scene, ScenePortal, SceneOptions, sceneData, SceneManager } from "@eix/ui"
import { opacityPlugin } from "../plugins/opacity";
import { zindex } from "../plugins/zindex";


    @Scene({
        template: (_target: any) => html`
             ${ _target.first ? html`<img src="${_target.url}" @click=${() => {
               //@ts-ignore
                window.loadScene(_target.next)

                //set first
                _target.first = false
            }}>` : html`<img src="${_target.url}">`}
        `,
        render,
        name: "tutorial",
        plugins: [zindex, opacityPlugin, {
            events: {
                start: (_val: boolean, data: sceneData) => {
                    // data.instance.started = true
                    data.instance.opacity = 1
                },
                stop: (_val: boolean, data: sceneData) => {
                    // data.instance.started = false
                    data.instance.opacity = 0
                }
            }
        }]
    })
    export class ImageScene2 {
        @ScenePortal<boolean>()
        started: boolean

        @ScenePortal<string>()
        next:string

        @ScenePortal<boolean>()
        first = true

        //opacity plugin
        @ScenePortal<number>()
        opacity = 0
        opacitySmoothness = 30
        defaultDisplay = "block"

        @ScenePortal<string>()
        url: string

        constructor(url: string,next:string) {
            this.url = url;
            this.next = next;
        }
    }