import { useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { IconDuoTone } from './components/Icon'

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
		not_assigned,
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


	const monthNumber = date.getMonth()
	const yearNumber = date.getFullYear();

	const now = new Date()
	const isOpen = date < now

	// address = address
	// .split(',')
	// .map(line => <p>{line}</p>)

	const noImageFallbackOptions = ['mode_cool', 'crib', 'star', 'stars_2', 'star_shine', 'moon_stars', 'featured_seasonal_and_gifts', 'park', 'favorite', 'ice_skating', 'sledding', 'gondola_lift', 'candle', 'celebration', 'landscape', 'mail', 'notifications', 'cookie']
	const dateSeed = (yearNumber * 31 + monthNumber) * 31 + daynumber + (isSunday * 1);
	const hash = dateSeed * 1103515245;
	const index = Math.floor((hash >>> 0) / (0x100000000 / noImageFallbackOptions.length)) % noImageFallbackOptions.length;
	const noImageFallbackIcon = noImageFallbackOptions[index];


	return (
		<div
			className={
				[
					'cardInner',
					isSunday && 'isSunday'
				].filter(Boolean).join(' ')
			}
		>
			<h2 className={monthNumber === 10 ? 'number small' : 'number'}>
				{
					monthNumber === 10
						? date.toLocaleString("de", { day: 'numeric', month: "short", timeZone: 'UTC' })
						: daynumber
				}
			</h2>
			<p className="weekday">{weekday}</p>

			{
				(not_assigned !== true
					&& !!timeString
					&& timeString !== '')
					? <p className="infoLine time">
						<IconDuoTone
							name="schedule"
							weight={timeString !== '18:00' ? 'bold' : 'normal'}
						/>
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

			{
				!!note && note !== ''
					? <p className="infoLine note" style={{ alignItems: 'start' }}>
						<IconDuoTone name="info" weight={999} />
						<strong>{note}</strong>
					</p>
					: null
			}

			<div className="spacer" />

			{
				isOpen === true && not_assigned !== true ?
					(coverphotoPath !== ''
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
						: <div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							opacity: 1,
							color: 'var(--text)'
						}}>
							<IconDuoTone
								name={noImageFallbackIcon}
								size="4xl"
								weight="400"
							/>
						</div>)
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
