import { useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'

function Card({ data }) {
	let {
		date: dateString,
		time,
		address,
		video,
		thumbnail,
		photos,
		text,
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

	const date = new Date(dateString)
	const weekday = date.toLocaleString("de", { weekday: "long" })
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
			}>
			<h2 className="number">{daynumber}</h2>
			<p className="weekday">{weekday}</p>

			{
				!!time
					&& time !== ''
					? <p className="infoLine time">
						<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="black"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.25 12.15L11 13V7h1.5v5.25l4.5 2.67-.75 1.23z" opacity=".1" /><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
						<span>{time}</span>
					</p>
					: null
			}
			{
				!!address
					&& address !== ''
					? <p className="infoLine address">
						<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" version="1" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M18.5,10.2c0,2.57-2.1,5.79-6.16,9.51L12,20.01l-0.34-0.31C7.6,15.99,5.5,12.77,5.5,10.2 c0-3.84,2.82-6.7,6.5-6.7S18.5,6.35,18.5,10.2z" fillOpacity=".1" /><path d="M12,2c4.2,0,8,3.22,8,8.2c0,3.32-2.67,7.25-8,11.8c-5.33-4.55-8-8.48-8-11.8C4,5.22,7.8,2,12,2z M18,10.2 C18,6.57,15.35,4,12,4s-6,2.57-6,6.2c0,2.34,1.95,5.44,6,9.14C16.05,15.64,18,12.54,18,10.2z M12,12c-1.1,0-2-0.9-2-2s0.9-2,2-2 s2,0.9,2,2S13.1,12,12,12z" /><path d="M0,0h24v24H0V0z" fill="none" /></svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M20 10H5.76L4 6.47V18h16z" opacity=".1" /><path d="M2.01 6L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2zM4 6.47L5.76 10H20v8H4V6.47z" /></svg>
						<span>{video.title}</span>
					</p>
					: null
			}
			{
				isOpen === true
					&& !!photos
					&& photos.length > 0
					? <p className="infoLine">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 5H5v14h14V5zM6 17l3-3.86 2.14 2.58 3-3.87L18 17H6z" opacity=".1" /><path d="M5 21h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zM5 5h14v14H5V5zm6.14 10.72L9 13.14 6 17h12l-3.86-5.14z" /></svg>
						<span>{photos.length === 1 ? 'ein Bild' : `${photos.length} Bilder`}</span>
					</p>
					: null
			}
			{
				isOpen === true
					&& !!text
					&& text !== ''
					? <p className="infoLine">
						<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><g><rect fill="none" height="24" width="24" y="0" /><path d="M5,5v14h14V5H5z M14,17H7v-2h7V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z" opacity=".1" /><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M17,13H7v-2h10 V13z M17,9H7V7h10V9z M14,17H7v-2h7V17z" /></g></svg>
						<span>Impuls-Text</span>
					</p>
					: null
			}

			<div className="spacer"></div>

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
		<svg viewBox="0 0 128 128">
			<text className="h4" x="60" y="30">ABC</text>
		</svg>
	*/
}

export default Card
