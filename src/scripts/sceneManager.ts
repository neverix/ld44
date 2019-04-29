import { SceneManager } from "@eix/ui"
import { GameScene } from "./scenes/game/GameScene"
import { MenuScene } from "./scenes/MenuScene"
import { GameOverScene } from "./scenes/GameOverScene";

const sceneManager = new SceneManager()
sceneManager.addScene("game", new GameScene())
sceneManager.addScene("menu", new MenuScene())
sceneManager.addScene("gameover", new GameOverScene())
let currentScene = "menu"
//@ts-ignore
window["loadScene"] = (newScene) => {
    sceneManager.switch(newScene, currentScene)
    console.log('ye')
    currentScene = newScene
}

export { sceneManager }