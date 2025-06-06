import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
// import reportWebVitals from './reportWebVitals'

import {
	HashRouter as Router,
} from 'react-router-dom'

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()

const url = window.location + ''
if (
	!url.startsWith('https')
	&& url.startsWith('http://adventskalender.puk-bonn.de')
) {
	window.location.replace(url.replace('http://', 'https://'))
}


