import { useState, useEffect } from 'react'
import Countdown from 'react-countdown'
import ReactMarkdown from 'react-markdown'
import { Helmet } from 'react-helmet'
import './sheet.css'
import videoCover from './images/video-cover.jpeg'

import {
	useParams,
	Link,
} from 'react-router-dom'

function Sheet({days}) {
	let { dateString } = useParams()

	const [thisDaysData, setThisDaysData] = useState(null)
	const [photoPath, setPhotoPaths] = useState([])

	useEffect(() => {
		async function loadPhotos(){
			const photos = thisDaysData.photos
			if (!!photos && photos.length > 0) {
				const paths = []
				for (let filename of photos) {
					const path = require('./photos/'+filename)
					paths.push(path.default)
				}
				setPhotoPaths(paths)
			}else{
				setPhotoPaths([])
			}
		}
		if (!!thisDaysData && !!thisDaysData.photos) {
			loadPhotos()
		}
	}, [thisDaysData])

	useEffect(() => {
		if (!!dateString) {
			const thisDaysData = days.filter(dayData => dayData.date === dateString)
			if (thisDaysData.length > 0) {
				setThisDaysData(thisDaysData[0])
			}else{
				setThisDaysData(null)
			}
		}else{
			setThisDaysData(null)
		}
	}, [days, dateString])

	const date = new Date(dateString)
	const weekday = date.toLocaleString("de", {weekday:"long"}) || ''
	const daynumber = date.getDate()

	const now = new Date()
	now.setHours(now.getHours() - 1)
	const isOpen = date < now

	if (!!thisDaysData) {
		return (
			<div className="sheet">
				<Link to="/" className="backdrop" />
				<article className="content">

				<Helmet>
					<title>{`Lebendiger Adventskalender • Tag ${date}`}</title>
					<meta name="description" content={`${thisDaysData.address}`} />
				</Helmet>

				<Link to="/" className="closebutton">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm5 11.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" opacity=".3"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/></svg>
				</Link>

				<div className="header">
					<h2 className="number">{daynumber}</h2>
					<p className="weekday">{weekday}</p>
					<p className="address">{thisDaysData.address}</p>
				</div>

				<Countdown
					date={date}
					renderer={({ days, hours, minutes, seconds, completed }) => {
						if (completed) {
							return null
						} else {
							return <>
								<br />
								<strong>Das Fenster öffnet in…</strong><br/>
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
					}}
				/>

				{
					isOpen === true
					&& photoPath.length > 0
					? photoPath.map(path => (
						<a className="photo" key={path} href={path} target="_blank" rel="noreferrer">
							<img src={path} alt="Geschmücktes Fenster"/>
						</a>
					))
					: null
				}

				{
					isOpen === true
					&& !!thisDaysData.text
					&& thisDaysData.text !== ''
					? <ReactMarkdown className="text" allowDangerousHtml>{thisDaysData.text}</ReactMarkdown>
					: null
				}

				{
					isOpen === true
					&& !!thisDaysData.video
					&& thisDaysData.video !== ''
					&& !!thisDaysData.video.url
					&& thisDaysData.video.url !== ''
					&& !!thisDaysData.video.title
					&& thisDaysData.video.title !== ''
					? <a className="videoCover" href={thisDaysData.video.url} target="_blank" rel="noopener noreferrer">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zM10 7.5l6 4.5-6 4.5v-9z" opacity=".3"/><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-2 3.5v9l6-4.5z"/></svg>
						<img src={videoCover} alt=""/>
					</a>
					: null
				}

				</article>
			</div>
		)
	}else{
		return ''
	}
}

export default Sheet
