import './App.css'
import Countdown from 'react-countdown'
import Footer from './Footer.js'
 
const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		return <span>Adventskalender</span>
	} else {
		return <div className="main-page-countdown h4">
			<strong>Das erste Fenster öffnet in…</strong><br/>
			<table style={{margin:'0 auto'}}>
				{days === 0 ? null : (<tr><td style={{textAlign:'right'}}>{days}</td><td style={{textAlign:'left'}}>{days === 1 ? 'Tag' : 'Tagen'}</td></tr>)}
				{hours === 0 ? null : (<tr><td style={{textAlign:'right'}}>{hours}</td><td style={{textAlign:'left'}}>{hours === 1 ? 'Stunde' : 'Stunden'}</td></tr>)}
				{minutes === 0 ? null : (<tr><td style={{textAlign:'right'}}>{minutes}</td><td style={{textAlign:'left'}}>{minutes === 1 ? 'Minute' : 'Minuten'}</td></tr>)}
				<tr><td style={{textAlign:'right'}}>{seconds}</td><td style={{textAlign:'left'}}>{seconds === 1 ? 'Sekunde' : 'Sekunden'}</td></tr>
			</table>
		</div>
	}
};

function App() {
	const calendarStart = new Date(2020,11,1,18,0,0,0) // 1 of Dezember

	return (
		<>
			<svg viewBox="0 0 775 305" className="svg-header">
				<text className="h1" x="10" y="90">Lebendiger</text>
				<text className="h1" x="10" y="200">Adventskalender</text>
				<text className="h1" x="10" y="290">2020</text>
			</svg>
        	
			<Countdown
				date={calendarStart}
				renderer={renderer}
			/>

			<Footer />
		</>
	)
}

export default App
