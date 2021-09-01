export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isLengthMedia = (time, lengthMedia) => {
    if(time > lengthMedia) return true
    return false
}