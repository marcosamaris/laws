# LingView
A web interface for viewing glossed ELAN and FLEx files, optionally with time-synced video and audio. Developed at Brown University as part of the A'ingae Language Documentation initiative, this fork is a generalization of the A'ingae-specific website [here](https://github.com/Designist/Korpus).

Front-end code written with [ReactJS](https://reactjs.org/).

## Update: FLEx-with-media support
LingView now supports .flextext files as source documents. (Flextext is the format used for exporting a file from ELAN to FLEx or vice versa.) The new format can include timing information and can therefore be displayed with synced audio/video. To start using .flextext files, [update LingView](https://github.com/BrownCLPS/LingView/wiki/Update-LingView).

## Getting Started
To begin using this site, you'll need to have NPM and Node.js installed. [Details can be found on the NPM website.](http://blog.npmjs.org/post/85484771375/how-to-install-npm) Then, clone this repository and run the command:
    `npm install`
    
This will install all the node modules required by our program. After making changes to a file, you'll need to bundle the code with [Webpack](https://webpack.js.org/). To do so, simply type the command "webpack" in the repository's root directory.

~~**WARNING: Current offline version not compatible with Chrome. See here:  https://stackoverflow.com/questions/20904098/react-js-example-in-tutorial-not-working**~~

To view the website in Chrome:
1. Run `webpack`.
2. Open `index.html`.

## Resources

For an overview of the software, its potential uses, and the circumstances and design principles of its creation, see our [paper](http://hdl.handle.net/10125/24916).

For how-to's and troubleshooting, check the [wiki](https://github.com/BrownCLPS/LingView/wiki). 

Using LingView? We'd love to hear from you! You can reach us at [kalinda.pride@gmail.com](mailto:kalinda.pride@gmail.com). 

Stuck? Start by reading our paper, browsing the wiki, and playing around with the software for an hour or two. If those don't solve your problem, [contact us](mailto:kalinda.pride@gmail.com). 

Contributors welcome!