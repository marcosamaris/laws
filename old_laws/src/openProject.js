import rebuild from './rebuild_openproject';
import XML2JS from 'xml2js';
import Extract from './extract_eaf_data';



  window.function_open_project = function function_open_project(){ 
    var file = document.getElementById('open_here');
    var reader = new FileReader();
    reader.onloadend = function() {
      if(file.files.length == 1){
        document.querySelector('[wm-frame=trilhas]').scrollIntoView();
        XML2JS.parseString(reader.result, function(err1, jsonData){
                if(err1) throw err1;
                const adoc = jsonData.ANNOTATION_DOCUMENT
                
                rebuild.startPhrases(adoc)
                //console.log(Extract.getPhrases(adoc))
                //console.log(Extract.getNonemptyTiers(adoc))
                //console.log(Extract.getVideoUrl(adoc))
              });

          }
        }
    reader.readAsText(file.files[0])
  }
