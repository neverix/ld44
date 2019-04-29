import { SceneManager } from "@eix/ui"
import { GameScene } from "./scenes/game/GameScene"
import { MenuScene } from "./scenes/MenuScene"
import { GameOverScene } from "./scenes/GameOverScene";
import { ScreenScene } from "./scenes/fullScreenScene"

const sceneManager = new SceneManager()
sceneManager.addScene("game", new GameScene())
sceneManager.addScene("menu", new MenuScene())
sceneManager.addScene("gameover", new GameOverScene())
sceneManager.addScene("screen", new ScreenScene())

//show full screen button
sceneManager.switch("screen")
// sceneManager.switch("menu")

let currentScene = ""
//@ts-ignore
window["loadScene"] = (newScene) => {
    sceneManager.switch(newScene, currentScene)
    console.log('ye',newScene)
    currentScene = newScene
}

export { sceneManager }