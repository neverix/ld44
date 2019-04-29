export const loadImage = (url:string) => {
    //create instance
    const img = new Image()

    //set src
    img.src = url

    //return the result
    return img
}