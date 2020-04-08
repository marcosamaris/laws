// import WaveSurfer from 'wavesurfer.js';
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';


//     var element_control_media = document.getElementById("iframe-controls-media");
//     var element_ondas_and_li = document.getElementById("iframe-ondas-and-li");
//     var iframe_control_media = element_control_media.contentWindow.document || element_control_media.contentDocument;
//     var iframe_ondas_and_li = element_ondas_and_li.contentWindow.document || element_ondas_and_li.contentDocument;


//     var wavesurfer = WaveSurfer.create({
//         container: document.querySelector('#waveform'),
        
//         plugins: [
//           TimelinePlugin.create({
//               container: "#wave-timeline",
              
//           })
//         ],
//         backend: 'MediaElement'
//     });


function function_new_project(){
      
    var video = document.querySelector('video');
    var audio = document.querySelector('audio');
    var element_Li = document.getElementById("tag-li-media");
    var inputs = document.getElementById('inputs');  
    var file = document.getElementsByClassName('file_here');
    inputs.style.display='none';

    wavesurfer.setCursorColor();
    
    var reader = new FileReader();
    reader.onloadend = function() {
      if(file[0].files.length == 1){
        video.src = reader.result;
        video.play();
        wavesurfer.load(video);
        //wavesurfer.play();
        document.querySelector("audio").style.display = "none";
        element_Li.textContent=file[0].files[0].name

        
      }
      else if(file[1].files.length == 1){
        audio.src = reader.result;
        audio.play();
        
        wavesurfer.load(audio);
        //wavesurfer.play();
        //document.querySelector("video").style.display = "none";
        element_Li.textContent=file[1].files[0].name
        
      }
      
    }
    
    if (file[0].files[0]){
      reader.readAsDataURL(file[0].files[0]);
    }
    else if (file[1].files[0]){
      reader.readAsDataURL(file[1].files[0]);
    }
    
  }