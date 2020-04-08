

function filePause(){
    let video = document.getElementById('video');
    if(video.src =! undefined){
      video.pause();
      console.log(video.controller);
    }
  }

  function filePlayPause(){
    var play = false;
    var img = document.getElementById("play_pause");
    var video = document.getElementById('video');
    if(video.src){
      video.play();
      img.innerHTML = `<img src="/img/pause.png">`
    }
  }
  
  function fileNextPixel(){    }
  function fileNextFrame(){    }
  function fileNextSecond(){
    wavesurfer.setCurrentTime(wavesurfer.getCurrentTime()+1);
  }
  function fileNextEnquadrament(){    }
  function fileNextFinal(){    }
  function filePreviousPixel(){
    
  }
  function filePreviousFrame(){    }
  function filePreviousSecond(){
    wavesurfer.setCurrentTime(wavesurfer.getCurrentTime()-1);
  }
  function filePreviousEnquadrament(){    }
  function filePreviousFinal(){    }