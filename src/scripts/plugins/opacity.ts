import { Plugin, sceneData } from "@eix/ui";

const opacityKey = Symbol("opacityKey")

export const opacityPlugin: Plugin = {
    events: {
        start: (val: boolean, data: sceneData) => {
            //only if not marked
            if (data.instance[opacityKey]) return
           
            //mark it
            data.instance[opacityKey] = true

            //current opacity
            let secret = data.instance.opacity

            //display 
            const display = data.instance.defaultDisplay || "block"

            data.parent.style.display = "none"

            setInterval(() => {
                const { opacity, opacitySmoothness } = data.instance

                if (secret == opacity) return 

                secret += (opacity - secret) / opacitySmoothness

                //update 
                data.parent.style.opacity = `${secret}`

                // console.log({ secret, display })

                //fix display
                if (secret < 0.1)
                    data.parent.style.display = "none"
                else
                    data.parent.style.display = display

                //fix small diplacement
                if (Math.abs(secret - opacity) < 0.1)
                    secret = opacity

            }, 1000 / 60)
        },
        stop: () => { }
    }
} 