import { SceneManager } from "@eix/ui"
import { GameScene } from "./scenes/game/GameScene"
import { MenuScene } from "./scenes/MenuScene"
import { GameOverScene } from "./scenes/GameOverScene";
import { ScreenScene } from "./scenes/fullScreenScene"
import { ImageScene } from "./scenes/story";
import { ImageScene2 } from "./scenes/tutorial";

const sceneManager = new SceneManager()
sceneManager.addScene("story", new ImageScene(require("../../img/titles/story.png"), "tutorial"))
sceneManager.addScene("game", new GameScene())
sceneManager.addScene("menu", new MenuScene())
sceneManager.addScene("tutorial", new ImageScene2(require("../../img/titles/controls.png"), "game"))
sceneManager.addScene("gameover", new GameOverScene())
sceneManager.addScene("screen", new ScreenScene())

//show full screen button
sceneManager.switch("screen")
// sceneManager.switch("screen","story")
// sceneManager.switch("menu")

let currentScene = ""
//@ts-ignore
window["loadScene"] = (newScene) => {
    sceneManager.switch(newScene, currentScene)
    console.log('ye', newScene)
    currentScene = newScene
}

export { sceneManager }