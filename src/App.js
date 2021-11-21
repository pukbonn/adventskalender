import { useState, useEffect, Component } from 'react'

import './app.css'
import './cards.css'
import { Helmet } from 'react-helmet'
import Countdown from 'react-countdown'
import Footer from './Footer.js'
import Card from './Card.js'
import Sheet from './Sheet.js'

import YAML from 'yaml'

import data_yaml_path from './data.yaml'

import {
	Route,
	NavLink,
	useLocation,
} from 'react-router-dom'



// START stats

function uuidv4() {
	// SOURCE: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		// eslint-disable-next-line
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

function getUserSessionID(){
	let userSessionID = sessionStorage.userSessionID

	if (!(!!userSessionID) || userSessionID === '') {
		userSessionID = uuidv4()
		sessionStorage.userSessionID = userSessionID
	}

	return userSessionID
}

async function sendStats(){
	const webhookURL = 'https://enlifdzpibv0of7.m.pipedream.net'
	fetch(webhookURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			mode: 'cors',
		},
		body: JSON.stringify({
			ts: new Date().toISOString(),
			url: window.location.href,
			userSessionID: getUserSessionID(),
			referrer: document.referrer,
			language: window.navigator.language,
			viewportWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
			viewportHeight: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
			userAgent: window.navigator.userAgent,
		})
	})
}

// END stats



const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		return null
	} else {
		return <>
			<br />
			<strong>Das erste Fenster öffnet in…</strong><br/>
			<table>
				<tbody>
					{days === 0 ? null : (<tr><td style={{textAlign:'right'}}>{days}</td><td style={{textAlign:'left'}}>{days === 1 ? 'Tag' : 'Tagen'}</td></tr>)}
					{hours === 0 ? null : (<tr><td style={{textAlign:'right'}}>{hours}</td><td style={{textAlign:'left'}}>{hours === 1 ? 'Stunde' : 'Stunden'}</td></tr>)}
					{minutes === 0 ? null : (<tr><td style={{textAlign:'right'}}>{minutes}</td><td style={{textAlign:'left'}}>{minutes === 1 ? 'Minute' : 'Minuten'}</td></tr>)}
					<tr><td style={{textAlign:'right'}}>{seconds}</td><td style={{textAlign:'left'}}>{seconds === 1 ? 'Sekunde' : 'Sekunden'}</td></tr>
				</tbody>
			</table>
		</>
	}
}

class SheetBodyStyle extends Component {
	componentDidMount() {
		document.body.classList.add('sheetIsOpen');
	}

	componentWillUnmount() {
		document.body.classList.remove('sheetIsOpen');
	}

	render() {
		return null
	}
}

function App() {
	const location = useLocation()
	const [year, ] = useState(new Date().getFullYear())

	useEffect(() => {
		sendStats()
	}, [location])

	const [data, setData] = useState({
		days: [],
	})

	useEffect(() => {
		fetch(data_yaml_path)
		.then(async response => {
			setData(YAML.parse(await response.text()))
		})
		.catch(error=> console.error(error))
	}, [])

	const days = data.days.filter(day => new Date(day.date).getFullYear() === year)

	const calendarStart = new Date(2020,11,1,18,0,0,0) // 1 of Dezember
	return (
		<>
			<header>
			<Helmet>
				<title>Lebendiger Adventskalender</title>
				<meta name="description" content="Ein ökumenisches Projekt der Pfarrei St. Maria Magdalena und Christi Auferstehung und der Evangelische Trinitatiskirchengemeinde Bonn-Endenich." />
			</Helmet>

			<svg viewBox="0 0 775 215" className="svg-header">
				<text className="h1" x="10" y="90">Lebendiger</text>
				<text className="h1" x="10" y="200">Adventskalender</text>
			</svg>



			<div className="intro_text">
				<div className="inner">
					<p>
						Gemeindemitglieder aus St. Maria Magdalena und Trinitatis laden ein.<br />
						<strong>Jeweils von 18:00 bis 18:30 Uhr erstrahlt ein geschmücktes Fenster,</strong><br />
						spazieren Sie vorbei, vielleicht gibt es eine Überraschung.
					</p>
					<br />
					<p><strong>Die Gestaltung berücksichtigt die geltenden Coronabedingungen!</strong></p>
					<Countdown
						date={calendarStart}
						renderer={renderer}
					/>
				</div>
			</div>
			</header>



			<nav className="cards">
				{days.map(dayData =>
					<NavLink
						className="card"
						key={dayData.date}
						to={'/day/'+dayData.date}
					>
						<Card data={dayData} />
					</NavLink>
				)}
			</nav>

			<Route path="/day/:dateString">
				<SheetBodyStyle />
				<Sheet days={days}/>
			</Route>

			<Footer />
		</>
	)
}

export default App
