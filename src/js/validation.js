import $ from 'jquery'
export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isLengthMedia = (time) => {
    if(time > $('#video')[0].duration*1000) return true
    return false
}

export const isDigit = (value) => {
    if(String(value).indexOf('.') != -1 || String(value).indexOf('e') != -1 || String(value).indexOf(',') != -1)
        return false
    return true

}