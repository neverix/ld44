interface EnemyType {
    name: string
    strength: number
    speed: number
    health: number
}

const enemyTypes: EnemyType[] = [
    {
        name: "kid",
        strength: 10,
        health: 1,
        speed: 10
    }
]

export { EnemyType, enemyTypes }