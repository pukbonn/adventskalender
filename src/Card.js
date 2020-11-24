import { useState, useEffect } from 'react'

function Card({data}) {
	let {
		date,
		cover,
		photos,
		address
	} = data

	const [coverphotoPath, setCoverphotoPath] = useState('')

	useEffect(() => {
		async function loadImage(){
			if (!!photos && photos.length > 0 && photos[0] !== '') {
				const path = require('./photos/'+photos[0])
				setCoverphotoPath(path.default)
			}else if (!!cover && cover !== '') {
				const path = require('./covers/'+cover)
				setCoverphotoPath(path.default)
			}
		}
		loadImage()
	}, [photos, cover])

	address = address
	.split(',')
	.map(line => <p>{line}</p>)

	// const coverphotoPath1 = 'https://unsplash.com/photos/czvOY2ikK3Y/download?force=true&w=640'

	return (
		<div className="card">
			<h2 className="number">{date}</h2>
			{
				coverphotoPath !== ''
				? <div className="image" style={{
					backgroundImage: `url(${coverphotoPath})`,
				}}></div>
				: null
			}
			<p className="address">{address}</p>
		</div>
	)

	/*
		<svg viewBox="0 0 128 128">
			<text className="h4" x="60" y="30">ABC</text>
		</svg>
	*/
}

export default Card
