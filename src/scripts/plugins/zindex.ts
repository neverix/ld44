import { Plugin, sceneData } from "@eix/ui";

const firstTime = Symbol("firstTime") as any
let lastId = 10

export const zindex:Plugin = {
    events: {
        start: (val:any,data:sceneData) => {
            //only if not marked 
            if (!data.instance[firstTime]){
                //mark it
                data.instance[firstTime] = true

                //set zindex
                data.parent.style.zIndex = `${lastId++}`
            }
        },
        stop: () => {}
    }
}