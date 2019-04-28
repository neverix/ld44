import { SceneManager } from "@eix/ui"
import { GameScene } from "./scenes/game/GameScene"
import { MenuScene } from "./scenes/MenuScene"

const sceneManager = new SceneManager()
sceneManager.addScene("game", new GameScene())
sceneManager.addScene("menu", new MenuScene())
let currentScene = "menu"
//@ts-ignore
window["loadScene"] = (newScene) => {
    sceneManager.switch(newScene, currentScene)
    currentScene = newScene
}

export { sceneManager }