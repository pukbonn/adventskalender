import YAML from 'js-yaml'
import { Component, useCallback, useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { Helmet } from 'react-helmet'
import {
	NavLink,
	useHistory,
	useLocation,
	useRouteMatch,
} from 'react-router-dom'
import Card from './Card.js'
import Footer from './Footer.js'
import Sheet from './Sheet.js'
import './app.css'
import './cards.css'
import { MaterialIconStyle } from './components/Icon'
import { Marker } from './components/Marker'
import { ReactMap } from './components/ReactMap'
import data_yaml_path from './data.yaml'



// START stats

function uuidv4() {
	// SOURCE: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		// eslint-disable-next-line
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

function getUserSessionID() {
	let userSessionID = sessionStorage.userSessionID

	if (!(!!userSessionID) || userSessionID === '') {
		userSessionID = uuidv4()
		sessionStorage.userSessionID = userSessionID
	}

	return userSessionID
}

async function sendStats() {
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

		const currentYear = new Date().getFullYear()

		return <>
			<br />
			<strong>Das erste Fenster in {currentYear} öffnet in…</strong><br />
			<table>
				<tbody>
					{days === 0 ? null : (<tr><td style={{ textAlign: 'right' }}>{days}</td><td style={{ textAlign: 'left' }}>{days === 1 ? 'Tag' : 'Tagen'}</td></tr>)}
					{hours === 0 ? null : (<tr><td style={{ textAlign: 'right' }}>{hours}</td><td style={{ textAlign: 'left' }}>{hours === 1 ? 'Stunde' : 'Stunden'}</td></tr>)}
					{minutes === 0 ? null : (<tr><td style={{ textAlign: 'right' }}>{minutes}</td><td style={{ textAlign: 'left' }}>{minutes === 1 ? 'Minute' : 'Minuten'}</td></tr>)}
					<tr><td style={{ textAlign: 'right' }}>{seconds}</td><td style={{ textAlign: 'left' }}>{seconds === 1 ? 'Sekunde' : 'Sekunden'}</td></tr>
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

const currentYear = new Date().getFullYear()

function App() {
	const location = useLocation()
	const history = useHistory()

	const [dateString, setDateString] = useState('')
	const [year, setYear] = useState(currentYear)

	useEffect(() => {
		sendStats()
	}, [location])

	const urlMatch = useRouteMatch("/day/:dateString")
	useEffect(() => {
		if (urlMatch) {
			const newDateString = urlMatch.params.dateString
			setDateString(newDateString)

			const newDate = new Date(newDateString)
			const newYear = newDate.getFullYear()
			setYear(newYear)
		} else {
			setDateString('')
			setYear(currentYear)
		}
	}, [
		urlMatch,
		setYear,
	])

	const [data, setData] = useState({
		days: [],
	})

	useEffect(() => {
		fetch(data_yaml_path)
			.then(async response => {
				const loadedData = YAML.load(await response.text())
				loadedData.days = loadedData.days.map(day => {

					let dateString = day.date.toISOString()
					if (dateString.endsWith('T00:00:00.000Z')) {
						dateString = dateString.replace('T00:00:00.000Z', 'T18:00:00.000Z')
					}

					return {
						...day,
						date: day.date.toISOString().split('T')[0],
						fullDate: dateString,
					}

				})

				setData(loadedData)
			})
			.catch(error => console.error(error))
	}, [])

	const days = data.days.filter(day => new Date(day.date).getFullYear() === year)
	const years = [
		...data.days
			.reduce((years, day) => {
				years.add(new Date(day.date).getFullYear())
				return years
			}, new Set())
	]

	const handleYearChange = useCallback(year => {
		setYear(year)
		history.push(`/day/${year}`)
	}, [setYear, history])

	const entries = days
		.filter(day => new Date(day.date).getFullYear() === year)
		.sort((a, b) => new Date(a.date) - new Date(b.date))
		.filter(day => day.lat && day.lng)
		.map(day => {
			const date = new Date(day.fullDate)
			const daynumber = date.getDate()
			return {
				id: day.date,
				latitude: day.lat,
				longitude: day.lng,
				title: String(daynumber),
				url: `/#/day/${day.date}`,
			}
		})

	const calendarStart = new Date(currentYear, 11, 1, 18, 0, 0, 0) // 1 of Dezember
	return (
		<>
			<MaterialIconStyle />

			<header>
				<Helmet>
					<title>Lebendiger Adventskalender</title>
					<meta name="description" content="Gemeindemitglieder aus St. Maria Magdalena und Trinitatis laden ein. Jeweils von 18:00 bis 18:30 Uhr erstrahlt ein geschmücktes Fenster. Stehen bleiben, Lieder singen, Geschichten hören und bei Plätzchen und Glühwein/Tee miteinander ins Gespräch kommen." />
				</Helmet>

				<svg viewBox="0 0 775 215" className="svg-header">
					<title>Lebendiger Adventskalender</title>
					<text className="h1" x="10" y="90">Lebendiger</text>
					<text className="h1" x="10" y="200">Adventskalender</text>
				</svg>



				<div className="intro_text">
					<div className="inner">
						<p>
							Gemeindemitglieder aus St. Maria Magdalena und Trinitatis laden ein.<br />
							<strong>Jeweils von 18:00 bis 18:30 Uhr (Ausnahme siehe Hinweis am Termin) erstrahlt ein geschmücktes Fenster.</strong> Stehen bleiben, Lieder singen, Geschichten hören und bei Plätzchen und Glühwein/Tee miteinander ins Gespräch kommen.
						</p>
						<br />
						<p>
							Für Fragen und Anregungen können Sie sich gerne an <a href="mailto:uta.luenebach@netcologne.de">uta.luenebach@netcologne.de</a> wenden.
						</p>
						<br />
						<Countdown
							date={calendarStart}
							renderer={renderer}
						/>
					</div>
				</div>
			</header>

			<div style={{ width: 'fit-content', padding: '32px', margin: '0 auto' }}>

				<nav className="years">
					{years.map(thisYear => <span className={thisYear === year ? 'active' : ''} key={thisYear} onClick={() => handleYearChange(thisYear)}>{thisYear}</span>)}
				</nav>

				<nav className="cards">
					{days
						.sort((a, b) => new Date(a.date) - new Date(b.date))
						.map(dayData => {
							return <NavLink
								className="card"
								key={dayData.date}
								to={'/day/' + dayData.date}
							>
								<Card data={dayData} />
							</NavLink>
						})}
				</nav>


				{entries.length === 0 ? null :
					<div
						key={JSON.stringify(entries)}
						className="map-container"
					>
						<ReactMap
							key={JSON.stringify(entries)}
							entries={entries}
							onEntryMarkerClick={({ entry }) => {
								if (entry.url) {
									if (entry.url.startsWith('http')) {
										window.open(entry.url, '_blank', 'noopener')
									} else {
										window.open(entry.url, '_self')
									}
								}
							}}
							renderEntryMarker={({ entry, index, ref, onImageLoaded }) => (
								<Marker entry={entry} index={index} onImageLoaded={onImageLoaded} ref={ref} />
							)}
						/>
					</div>}
			</div>

			{
				typeof dateString === 'string'
					&& dateString.length > 0
					&& dateString.includes('-')
					? <>
						<SheetBodyStyle />
						<Sheet
							dateString={dateString}
							days={data.days}
						/>
					</>
					: null
			}

			<Footer />
		</>
	)
}

export default App
