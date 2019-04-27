import { Scene } from "./scene"
import { Portal } from "@eix/ui"
import { TemplateResult, render } from "lit-html"

/**
 * scene processed when loading
 */
interface ProcessedScene {
    /**
     * name of the scene
     */
    name: string
    /**
     * HTML element to render the scene to
     */
    element: HTMLElement
    /**
     * the source scene
     */
    scene: Scene<any, any>
    /**
     * the state of the scene
     */
    state: { state: any }
}

/**
 * @eix/ui renderer
 * @param result template result
 * @param target HTML element to render to
 */
function renderer(result: TemplateResult, target: HTMLElement) {
    render(result, target)
}

/**
 * start the game
 * @param scenes scenes in the game
 * @param startFrom name of the scene to start from
 */
export function start(scenes: Scene<any, any>[], startFrom: string) {
    // process scenes
    const scenesDict: { [name: string]: ProcessedScene } = {}
    scenes.forEach(scene => {
        // create HTML element
        const element = document.body.appendChild(document.createElement("div"))
        // get the name
        const name = scene.name
        // the state class. really didn't want to do it but time is money!
        class State {
            @Portal(element, scene.render, renderer, false)
            state = {}
        }
        // create state
        const state = new State()
        // save the processed scene
        scenesDict[scene.name] = {
            name, element, scene, state
        }
    })
    // scene utilities object (only switching for now)
    const sceneUtils = {
        /**
         * load a new scene
         * @param sceneName name of the scene to load
         * @param args arguments passed to the scene
         */
        start: (sceneName: string, args: any) => {
            // hide all scenes besides the current one
            for (let scene in scenesDict) {
                scenesDict[scene].element.style.display = scene == sceneName ? "block" : "none"
            }
            // start the scene
            scenesDict[sceneName].scene.start(args, (state: any) => {
                scenesDict[sceneName].state.state = state
            })
        }
    }
    //@ts-ignore
    window.sceneUtils = sceneUtils
    const startScene = scenesDict[startFrom]
    sceneUtils.start(startScene.name, startScene.scene.defaultArgs)
}