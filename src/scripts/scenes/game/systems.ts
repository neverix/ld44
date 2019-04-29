import { Background } from "./systems/tree/background"
import { EnemySpawner } from "./systems/enemies/enemySpawner"
import { Enemy } from "./systems/enemies/enemy"
import { Tree } from "./systems/tree/tree";
import { Branches } from "./systems/tree/branches";

export const systems = [
    Background,
    EnemySpawner,
    Enemy,
    Tree,
    Branches
]