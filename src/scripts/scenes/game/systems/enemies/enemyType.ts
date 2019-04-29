import { loadImage } from "../../../../loadStuff";

interface EnemyType {
    name: string
    strength: number
    speed: number
    health: number
    images:  HTMLImageElement[]
    fps: number
}

const enemyTypes: EnemyType[] = [
    {
        name: "kid",
        strength: 10,
        health: 1,
        speed: 2,
        images: [
            loadImage("/img/enemy1/enemy1.png"),
            loadImage("/img/enemy1/enemy2.png"),
            loadImage("/img/enemy1/enemy2.png")
        ],
        fps: 10
    }
]

export { EnemyType, enemyTypes }