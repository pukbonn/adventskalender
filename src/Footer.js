// import './Footer.css'

import puk_logo from './images/Logo_rechts_fh_mit-farbkorrektur-von-thomas.svg'
import trini_logo from './images/Trini-Logo-Schriftszug-transparent.png'
import lak_logo from './images/LAK-desaturated.svg'

function Footer() {
	return (<>       	
		<div className="footer">
			Ein ökumenisches Projekt der <a href="https://puk-bonn.de">Pfarrei St. Maria Magdalena und Christi Auferstehung</a> und der <a href="https://www.trinitatiskirche-bonn.de/">Evangelische Trinitatiskirchengemeinde Bonn-Endenich</a>.

		</div>
		<div className="footer_logos">
			<a href="https://puk-bonn.de">
				<img
					src={puk_logo}
					alt="Logo der Pfarrei St. Maria Magdalena und Christi Auferstehung"
				/>
			</a>
			<a href="https://www.lebendiger-adventskalender.de/">
				<img
					src={lak_logo}
					alt="Logo des Lebendigen Adventskalenders"
				/>
			</a>
			<a href="https://www.trinitatiskirche-bonn.de/">
				<img
					src={trini_logo}
					alt="Logo der Evangelische Trinitatiskirchengemeinde Bonn"
				/>
			</a>
		</div>
		<div className="thomasLine">
			Design und Programmierung von <a href="https://thomasrosen.qiekub.org/" target="_blank" rel="noreferrer">Thomas Rosen</a>.
		</div>
	</>)
}

export default Footer
