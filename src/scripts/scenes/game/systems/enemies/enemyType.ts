interface EnemyType {
    name: string
    strength: number
    speed: number
    health: number
}

const enemyTypes: EnemyType[] = [
    {
        name: "kid",
        strength: 40,
        health: 1,
        speed: 2
    }
]

export { EnemyType, enemyTypes }