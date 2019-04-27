import { Scene } from "../scene"
import { html, TemplateResult } from 'lit-html'

/**
 * state for the menu
 */
interface MenuState {

}

/**
 * arguments for loading the menu
 */
interface MenuArgs {

}

/**
 * the menu scene
 */
export class MenuScene implements Scene<MenuState, MenuArgs> {
    name: string = "menu"
    initialState: MenuState = {}
    render(state: MenuState): TemplateResult {
        return html`
            <h1>LD44</h1>
            <a onclick=sceneUtils.start("game")>play</a>
        `
    }
    start(args: MenuArgs) { }
    stop() { }
    defaultArgs = {}
}