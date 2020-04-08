import WaveSurfer from 'https://unpkg.com/wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js'

    var wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: '#000000',
        progressColor: '#f1f1f1',
        plugins: [
          TimelinePlugin.create({
              container: "#wave-timeline",
              
          })
        ],
        backend: 'MediaElement'
    });

    function loadFile(){
      
      var video = document.querySelector('video');
      var audio = document.querySelector('audio');
      var file = document.getElementsByClassName('file_here');
      var element_Li = document.getElementById("tag-li-media");
      var inputs = document.getElementById('inputs');  
      inputs.style.display='none';

      wavesurfer.setCursorColor();
      
      reader = new FileReader();
      reader.onloadend = function() {
        if(file[0].files.length == 1){
          video.src = reader.result;
          video.play();
          wavesurfer.load(video);
          wavesurfer.play();
          document.querySelector("audio").style.display = "none";
          element_Li.textContent=file[0].files[0].name

          
        }
        else if(file[1].files.length == 1){
          audio.src = reader.result;
          audio.play();
          
          wavesurfer.load(audio);
          wavesurfer.play();
          //document.querySelector("video").style.display = "none";
          element_Li.textContent=file[1].files[0].name
          
        }
        else if(file[2].files.length == 1){
          var texto = reader.result.split('\n')
          var linhas = texto[3].split('=')[1]
          video.src=linhas.split('"', 2)[1]
          video.play()
          wavesurfer.load(video);
          wavesurfer.play();
          element_Li.textContent=texto[3].split('=')[3].split('/')[1].split('"')[0]
          console.log(texto[3].split('=')[3].split('/')[1].split('"')[0])
        }
        
      }
      
      if (file[0].files[0]){
        reader.readAsDataURL(file[0].files[0]);
      }
      else if (file[1].files[0]){
        reader.readAsDataURL(file[1].files[0]);
      }
      else if (file[2].files[0]){
        reader.readAsText(file[2].files[0]);        
      }
      else{
        video.src="";
      }
      
    }

    function filePause(){
      video = document.querySelector('video');
      if(video.src){
        video.pause();
        console.log(video.controller);
      }
    }

    function filePlay(){
      video = document.querySelector('video');
      if(video.src){
        video.play();
      }
    }
    
    function fileNextPixel(){    }
    function fileNextFrame(){    }
    function fileNextSecond(){    }
    function fileNextEnquadrament(){    }
    function fileNextFinal(){    }
    function filePreviousPixel(){    }
    function filePreviousFrame(){    }
    function filePreviousSecond(){    }
    function filePreviousEnquadrament(){    }
    function filePreviousFinal(){    }

  