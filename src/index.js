import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

import {
	HashRouter as Router,
} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
  </React.StrictMode>,
  document.getElementById('root')
);
		<Router>
			<App />
		</Router>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

const url = window.location+''
if (
	!url.startsWith('https')
	&& url.startsWith('http://adventskalender.puk-bonn.de')
){
	window.location.replace(url.replace('http://', 'https://'))
}


