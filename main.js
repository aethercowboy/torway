import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

require("./index.html");
require("./img/grid.png");

ReactDOM.render(<App />, document.getElementById('app'));

$(document).foundation();
