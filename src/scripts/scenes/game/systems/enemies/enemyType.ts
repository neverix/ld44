import { loadImage } from "../../../../loadStuff";

interface EnemyType {
    name: string
    strength: number
    speed: number
    health: number
    images: Promise<HTMLImageElement>[]
    fps: number
    points: number
}

const enemyTypes: EnemyType[] = [
    {
        name: "kid",
        strength: 10,
        health: 1,
        speed: 40,
        images: [
            loadImage(require("../../../../../../img/enemy1/enemy1.png")),
            loadImage(require("../../../../../../img/enemy1/enemy2.png")),
            loadImage(require("../../../../../../img/enemy1/enemy3.png"))
        ],
        fps: 10,
        points: 10
    }
]

export { EnemyType, enemyTypes }