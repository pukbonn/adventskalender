import { useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { IconDuoTone } from './components/Icon.jsx'

function Card({ data }) {
	let {
		date: dateString,
		fullDate: dateFullString,
		// time,
		address,
		video,
		thumbnail,
		photos,
		text,
		note,
	} = data

	const [coverphotoPath, setCoverphotoPath] = useState('')

	useEffect(() => {
		async function loadImage() {
			if (!!thumbnail && typeof thumbnail === 'string' && thumbnail !== '') {
				const path = require(`./photos/${dateString}/${thumbnail}`)
				setCoverphotoPath(path)
			} else {
				if (!!photos && Array.isArray(photos) && photos.length > 0 && photos[0] !== '') {
					const path = require(`./photos/${dateString}/${photos[0]}`)
					setCoverphotoPath(path)
				} else {
					setCoverphotoPath('')
				}
			}
		}
		loadImage()
	}, [thumbnail, photos, dateString])

	const date = new Date(dateFullString)
	const timeString = date.toLocaleString("de-DE", { hour: "2-digit", minute: '2-digit', timeZone: 'UTC' })
	// if (!!time && time !== '') {
	// 	timeString = time
	// }
	const weekday = date.toLocaleString("de", { weekday: "long", timeZone: 'UTC' })
	const isSunday = date.getDay() === 0
	const daynumber = date.getDate()

	const now = new Date()
	const isOpen = date < now

	// address = address
	// .split(',')
	// .map(line => <p>{line}</p>)

	return (
		<div
			className={
				[
					'cardInner',
					isSunday && 'isSunday'
				].filter(Boolean).join(' ')
			}
		>
			<h2 className="number">{daynumber}</h2>
			<p className="weekday">{weekday}</p>

			{
				!!timeString
					&& timeString !== ''
					? <p className="infoLine time">
						<IconDuoTone name="schedule" style={{
							'--weight': timeString !== '18:00' ? 900 : 400
						}} />
						{timeString !== '18:00' ? <strong>{timeString}</strong> : <span>{timeString}</span>}
					</p>
					: null
			}
			{
				!!address
					&& address !== ''
					? <p className="infoLine address">
						<IconDuoTone name="location_on" />
						<span>{address}</span>
					</p>
					: null
			}
			{
				!!video
					&& video !== ''
					&& !!video.title
					&& video.title !== ''
					? <p className="infoLine video">
						<IconDuoTone name="movie" />
						<span>{video.title}</span>
					</p>
					: null
			}
			{
				isOpen === true
					&& !!photos
					&& photos.length > 0
					? <p className="infoLine">
						<IconDuoTone name="photo" />
						<span>{photos.length === 1 ? 'ein Bild' : `${photos.length} Bilder`}</span>
					</p>
					: null
			}
			{
				isOpen === true
					&& !!text
					&& text !== ''
					? <p className="infoLine">
						<IconDuoTone name="article" />
						<span>Impuls-Text</span>
					</p>
					: null
			}

			<div className="spacer" />

			{
				!!note && note !== ''
					? <p className="infoLine note" style={{ alignItems: 'start' }}>
						<IconDuoTone name="info" />
						<span>{note}</span>
					</p>
					: null
			}

			{
				isOpen === true && coverphotoPath !== ''
					? (
						<LazyLoad
							offset={512}
							height={128}
							once
						>
							<div className="image" style={{
								backgroundImage: `url("${coverphotoPath}")`,
							}}>
								<img src={coverphotoPath} alt="Geschmücktes Fenster" />
							</div>
						</LazyLoad>
					)
					: null
			}
		</div>
	)

	/*
		<svg aria-hidden={true} viewBox="0 0 128 128">
			<text className="h4" x="60" y="30">ABC</text>
		</svg>
	*/
}

export default Card
