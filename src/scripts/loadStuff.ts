export const loadImage = (url:string) => {
    //create instance
    const img = new Image()

    //set src
    img.src = url

    //return the result
    return img
}

export const loadAudio = (url:string) => {
    //create instace
    const audio = new Audio(url)

    //enable looping
    audio.loop = true

    //return the result
    return audio
}