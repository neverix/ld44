import { System } from "../../system";
import { JobSystem, ECS } from "@eix/core";
import { EnemyType } from "./enemyType";

export const enemyAnimation: System = (js: JobSystem) => {
    js.tasks.update.addJob("enemyAnimation", (ecs: ECS) => {
        //select what we need
        const components = ecs.all
            .has("enemy")
            .get("enemy", "drawable", "images", "timer")

        //return a function
        return (delta: number) => {

            components.tracked.forEach((entity: any) => {
                //increase timer
                entity.timer.time += delta

                //get timestamp
                const minTimeStamp = 1000 / entity.enemy.fps

                if (minTimeStamp < entity.timer.time) {
                    //reset timer
                    entity.timer.time = 0

                    //get index of new image
                    const index = entity.images.indexOf(
                        entity.drawable.drawableContent.image
                    ) + 1
                    
                    //update image
                    entity.drawable.drawableContent.image = entity.images[
                        (index >= entity.images.length) ? 0 : index
                    ]
                }
            })
        }
    })
}