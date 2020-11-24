import { useState, useEffect } from 'react'

import './app.css'
import './cards.css'
import Countdown from 'react-countdown'
import Footer from './Footer.js'
import Card from './Card.js'

import YAML from 'yaml'

import data_yaml_path from './data.yaml'


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

function App() {
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

	const calendarStart = new Date(2020,11,1,18,0,0,0) // 1 of Dezember
	return (
		<>
			<svg viewBox="0 0 775 305" className="svg-header">
				<text className="h1" x="10" y="90">Lebendiger</text>
				<text className="h1" x="10" y="200">Adventskalender</text>
				<text className="h1" x="10" y="290">2020</text>
			</svg>

			

			<div className="intro_text">
				<div className="inner">
				<p>
					Gemeindemitglieder aus St. Maria Magdalena und Trinitatis laden ein.<br />
					<strong>Jeweils von 18.00 bis 18.30 Uhr erstrahlt ein geschmücktes Fenster,</strong><br />
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


			
			<div className="cards">
				{data.days.map(day =>
					<Card
						key={day.number}
						data={day}
					/>
				)}
			</div>
			
			

			<Footer />
		</>
	)
}

export default App
