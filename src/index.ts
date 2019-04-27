import { start } from "./scripts/start"
import { MenuScene } from "./scripts/scenes/MenuScene";
import { GameScene } from "./scripts/scenes/game/GameScene";
start([
    new MenuScene(),
    new GameScene()
], "menu")