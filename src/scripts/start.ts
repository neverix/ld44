import { Scene } from "./scene"
import { Portal } from "@eix/ui"
import { TemplateResult, render } from "lit-html"

interface ProcessedScene {
    name: string
    element: HTMLElement
    scene: Scene<any, any>
    state: any
}

function renderer(result: TemplateResult, target: HTMLElement) {
    console.log('ye')
    render(result, target)
}

export function start(scenes: Scene<any, any>[], startFrom: string) {
    const scenesDict: { [name: string]: ProcessedScene } = {}
    scenes.forEach(scene => {
        const element = document.body.appendChild(document.createElement("div"))
        const name = scene.name
        class State {
            @Portal(element, scene.render, renderer, false)
            state = {}
        }
        const state = new State()
        scenesDict[scene.name] = {
            name, element, scene, state
        }
    })
    const sceneUtils = {
        start: (sceneName: string) => {
            for (let scene in scenesDict) {
                scenesDict[scene].element.style.display = scene == sceneName ? "block" : "none"
            }
            scenesDict[sceneName].scene.start(scenesDict[sceneName].scene.defaultArgs)
            scenesDict[sceneName].state.state = scenesDict[sceneName].scene.initialState
        }
    }
    //@ts-ignore
    window.sceneUtils = sceneUtils
    const startScene = scenesDict[startFrom]
    sceneUtils.start(startScene.name)
}