
var {WaveSurfer} = require(['wavesurfer.js']);
var {TimelinePlugin} = require(['wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js']);

    var element_control_media = document.getElementById("iframe-controls-media");
    var element_ondas_and_li = document.getElementById("iframe-ondas-and-li");
    var iframe_control_media = element_control_media.contentWindow.document || element_control_media.contentDocument;
    var iframe_ondas_and_li = element_ondas_and_li.contentWindow.document || element_ondas_and_li.contentDocument;


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
      else if (file[2].files[0]){
        reader.readAsDataURL(file[2].files[0]);
      }
      else{
        video.src="";
      }
      
    }


    function function_open_project(){ 
      var file = document.getElementById('open_here');
      var element_Li = iframe_ondas_and_li.getElementById("tag-li-media");
      var video = iframe_control_media.getElementById("video");
      var audio = iframe_control_media.getElementById("audio");
      var column_one = document.getElementById("divrow1");
      var column_two = document.getElementById("divrow2");
      

      reader = new FileReader();
      reader.onloadend = function() {
        if(file.files.length == 1){

        getXmlFile(reader.result, function(xml){
          var urlVideo;
          var urlAudio;
          var element_LiText;
          var time_slot_id=[]
          var time_value=[]
          
          var participant;
          var type_ref;
          var tier_id;
          var parent_ref;
          var labeltransc;
          var labelwords;
          var labeltransl;
          var labelpartic;

          //extrai url do video
          if(xml.getElementsByTagName("MEDIA_DESCRIPTOR")[0].attributes[0].name=="MEDIA_URL"){
            urlVideo=xml.getElementsByTagName("MEDIA_DESCRIPTOR")[0].attributes[0].value;
            //title the video
            element_LiText=xml.getElementsByTagName("MEDIA_DESCRIPTOR")[0].attributes[2].value;
            element_Li.textContent = String(element_LiText).replace("./", "");
            
          }
          //extrai url do audio
          if(xml.getElementsByTagName("MEDIA_DESCRIPTOR")[1].attributes[1].name=="MEDIA_URL")
          urlAudio=xml.getElementsByTagName("MEDIA_DESCRIPTOR")[1].attributes[1].value;
          
          
          //extrai as marcações dos tempos
          for (const i of xml.getElementsByTagName("TIME_SLOT")) {
            time_slot_id.push(i.attributes[0].value)
            time_value.push(i.attributes[1].value)              
          }
          
          var trilhas=xml.getElementsByTagName("TIER");         
        
        

        console.log(column_one)
        //extrai as trilhas
        for (const i of trilhas) {
          for (const j of i.attributes) {
            switch(String(j.name)){
              case "LINGUISTIC_TYPE_REF":
                type_ref=j.value;
                break;
              case "PARTICIPANT":
                participant=new String(j.value);
                break;
              case "TIER_ID":
                tier_id=new String(j.value);
                break;
              case "PARENT_REF":
                parent_ref=new String(j.value);
                break;
            }
            
          }
          
          if(type_ref == "Phrases"){
            //var transcription= document.getElementById("transcription");
            labeltransc = `<li>${tier_id}</li>`;
            var annotation = i.getElementsByTagName("ANNOTATION_VALUE");
            console.log(type_ref + " " + tier_id)
            for (const phrases_annotation of annotation) {
              //transcription.value = phrases_annotation.innerHTML;
            }
          }

          if(type_ref=="Words"){
            //var words = document.getElementById("words");
            labelwords = `<li>${tier_id}</li>`;
            var annotationWords = i.getElementsByTagName("ANNOTATION_VALUE")
            var wordsConcat = new String();
            for (const words_annotation of annotationWords) {
              wordsConcat += words_annotation.innerHTML + " | "
              //words.value=wordsConcat
            }
          }

          if(type_ref=="Note" && tier_id.search("Translation") != -1){
            //var note = document.getElementById("translation");
            labeltransl = `<li>${tier_id}</li>`;
            var annotationNote = i.getElementsByTagName("ANNOTATION_VALUE")
            for (const note_annotation of annotationNote) {
              //note.value = note_annotation.innerHTML;
            }
          }

          if(type_ref=="Note" && tier_id.search("Participant-note")!=-1){
            //var noteParticipant = document.getElementById("participant");
            labelpartic = `<li>${tier_id}</li>`;
            var annotationnoteParticipant = i.getElementsByTagName("ANNOTATION_VALUE")
            for (const noteParticipant_annotation of annotationnoteParticipant) {
              //noteParticipant.value = noteParticipant_annotation.innerHTML;
            }
          }
        }
        column_one.innerHTML = labeltransc+
                                labelwords+
                                labeltransl+
                                labelpartic;
        
        console.log(column_one)
        var iframe = document.getElementById("iframe-trilhas");
        console.log(iframe.contentWindow.document)
        
        video.src=urlVideo;
        //wavesurfer.load(video);
        //wavesurfer.play();
        //video.play();
        
        
        
          });
        }
      }
      reader.readAsDataURL(file.files[0])
      console.log("function ok")
      console.log(file.files.length)
    }




    function getXmlFile(path, callback) {
      let request = new XMLHttpRequest();
      request.open("GET", path);
      request.setRequestHeader("Content-Type", "text/xml");
      request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status ===200){
          callback(request.responseXML);
        }
      };
      request.send();
    };