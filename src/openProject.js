import rebuild from './rebuild_openproject';
import XML2JS from 'xml2js';



  window.function_open_project = function function_open_project(){ 
    var file = document.getElementById('open_here');
    var reader = new FileReader();
    reader.onloadend = function() {
      if(file.files.length == 1){
        document.querySelector('[wm-frame=trilhas]').scrollIntoView();
        XML2JS.parseString(reader.result, function(err1, jsonData){
                if(err1) throw err1;
                const adoc = jsonData.ANNOTATION_DOCUMENT
                rebuild.startVideo(adoc)
                //console.log(Extract.getVideoUrl(adoc))
              });

          }
        }
    reader.readAsText(file.files[0])
  }
