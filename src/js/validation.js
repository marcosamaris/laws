import $ from 'jquery'
export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isLengthMedia = (time) => {

    if(time > $('#video').length*1000) return true
    return false
}