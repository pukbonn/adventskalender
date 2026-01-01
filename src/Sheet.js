import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { Icon, IconDuoTone } from './components/Icon'
import { NumbersDisplay } from './components/NumbersDisplay'
import videoCover from './images/video-cover.jpeg'
import './sheet.css'

function Sheet({ days, dateString }) {
	const [thisDaysData, setThisDaysData] = useState(null)
	const [photoPath, setPhotoPaths] = useState([])

	useEffect(() => {
		async function loadPhotos() {
			const photos = thisDaysData.photos
			if (!!photos && photos.length > 0) {
				const paths = []
				for (let filename of photos) {
					const path = require(`./photos/${dateString}/${filename}`)
					paths.push(path)
				}
				setPhotoPaths(paths)
			} else {
				setPhotoPaths([])
			}
		}
		if (!!thisDaysData && !!thisDaysData.photos) {
			loadPhotos()
		}
	}, [thisDaysData, dateString])

	useEffect(() => {
		if (!!dateString) {
			const thisDaysData = days.filter(dayData => dayData.date === dateString)
			if (thisDaysData.length > 0) {
				setThisDaysData(thisDaysData[0])
			} else {
				setThisDaysData(null)
			}
		} else {
			setThisDaysData(null)
		}
	}, [days, dateString])

	if (!thisDaysData) {
		return null
	}

	const dateFullString = thisDaysData.fullDate
	const date = new Date(dateFullString)
	const now = new Date()
	const isOpen = date < now

	const year = date.getFullYear()

	return (
		<div className="sheet">
			<Link to={`/day/${year}`} className="backdrop" />
			<article className="content">

				<Helmet>
					<title>{`Lebendiger Adventskalender • Tag ${date}`}</title>
					<meta name="description" content={`${thisDaysData.address}`} />
				</Helmet>

				<Link to={`/day/${year}`} className="closebutton">
					<Icon name="close" size="xl" style={{ '--weight': 900 }} />
				</Link>

				<div className="header">
					<h2 className="number">{date.toLocaleString("de-DE", { day: "numeric" })}</h2>

					<p className="weekday" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
						<IconDuoTone name="schedule" style={{ '--weight': 900 }} />
						<strong>{date.toLocaleString("de-DE", { year: "numeric", weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: '2-digit', timeZone: 'UTC' })}</strong>
					</p>

					{
						thisDaysData.address
							? <p className="address" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
								<IconDuoTone name="location_on" />
								<span>{thisDaysData.address}</span>
							</p>
							: null
					}
				</div>

				<Countdown
					date={date}
					renderer={({ days, hours, minutes, seconds, completed }) => {
						if (completed) {
							return null
						} else {
							const padLength = days > 99 ? 3 : 2

							return <>
								<br />
								<strong>Das Fenster öffnet in…</strong><br />

								<AnimatePresence initial={false} mode="popLayout">
									<NumbersDisplay padLength={padLength} count={days} singularLabel="Tag" pluralLabel="Tagen" />
									<NumbersDisplay padLength={padLength} count={hours} singularLabel="Stunde" pluralLabel="Stunden" />
									<NumbersDisplay padLength={padLength} count={minutes} singularLabel="Minute" pluralLabel="Minuten" />
									<NumbersDisplay padLength={padLength} count={seconds} singularLabel="Sekunde" pluralLabel="Sekunden" />
								</AnimatePresence>
							</>
						}
					}}
				/>

				{
					isOpen === true
						&& photoPath.length > 0
						? photoPath.map(path => (
							<a className="photo" key={path} href={path} target="_blank" rel="noreferrer">
								<img src={path} alt="Geschmücktes Fenster" />
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
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zM10 7.5l6 4.5-6 4.5v-9z" opacity=".3" /><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-2 3.5v9l6-4.5z" /></svg>
							<img src={videoCover} alt="" />
						</a>
						: null
				}

			</article>
		</div>
	)
}

export default Sheet
