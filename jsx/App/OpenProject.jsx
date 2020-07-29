import React from 'react';

export class OpenProject extends React.Component {
    constructor(props){
        super(props);
        this.fileInput = React.createRef();
        this.open_file = this.open_file.bind(this);
    }
    
    open_file(){
        
        //console.log(document.getElementById("file-here"))
        console.log(this.fileInput.current.files[0])
    }
  
    render() {
      return (
          <div>
            <form >
            <label>
                Upload file:
                <input type="file" id="file-here" ref = {this.fileInput}/>
            </label>
            <br />
            <input type="submit" value="Submit" onClick={this.open_file}/>
            </form>

          </div>
      );
    }

  }
  