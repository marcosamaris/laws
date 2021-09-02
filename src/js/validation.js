import $ from 'jquery'
export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isLengthMedia = (time) => {

    if(time > $('#video').length) return true
    return false
}