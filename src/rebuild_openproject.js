const extract = require('./extract_eaf_data')


function startVideo(adoc){
    const video = getVideo();
    video.src=extract.getVideoUrl(adoc);
    video.play();
}

function getVideo(){
    var wmframeondas = document.querySelector('[wm-frame=controls]')
    var video = (wmframeondas.contentWindow || wmframeondas.contentDocument).document.querySelector('#video')
    return video
}

module.exports = {
    startVideo: startVideo
};