const { writeFileSync, readFileSync } = require('fs')
const { tzlib_get_ical_block } = require('timezones-ical-library')
const { ICalCalendar } = require('ical-generator')
const { DateTime } = require('luxon')
const YAML = require('js-yaml')

const calendar_file_name = 'calendar.ics'

function loadEvents() {
  const event_file_path = `${__dirname}/src/data.yaml`
  const yaml_data_content = readFileSync(event_file_path, 'utf8')
  const loadedData = YAML.load(yaml_data_content)
  loadedData.days = loadedData.days
    .filter(day => day.not_assigned !== true) // only keep real events
    .map(day => {
      let dateString = day.date.toISOString()
      if (dateString.endsWith('T00:00:00.000Z')) {
        dateString = dateString.replace('T00:00:00.000Z', 'T18:00:00.000Z')
      }

      dateString = dateString.replace('.000Z', '.000') // REMOVE THE Z TO NOT BE MARKED AS UTC

      return {
        ...day,
        date: day.date.toISOString().split('T')[0],
        fullDate: dateString,
      }

    })

  return loadedData
}

const cal = new ICalCalendar({
  name: 'Lebendiger Adventskalender',
  domain: 'adventskalender.puk-bonn.de'
})
const calendar_source_url = `https://adventskalender.puk-bonn.de/${calendar_file_name}`
cal.source(calendar_source_url)
cal.url(calendar_source_url)
cal.ttl(60 * 60 * 24) // refresh once per 1 day
cal.prodId({
  company: 'pukbonn',
  product: 'adventskalender',
  language: 'DE'
})
cal.timezone({
  name: 'Europe/Berlin',
  generator: (tz) => tzlib_get_ical_block(tz)[0],
})


const loaded_events = loadEvents()
for (const event_data of loaded_events.days) {

  const utcDate = DateTime.fromISO(event_data.fullDate);
  const localStartDate = utcDate.setZone('Europe/Berlin');

  const event = cal.createEvent({
    start: localStartDate.toJSDate(),
    end: localStartDate.plus({ minutes: 30 }).toJSDate(),
    timezone: 'Europe/Berlin',

    summary: 'Lebendiger Adventskalender',
    description: [event_data.note, `Gemeindemitglieder aus St. Maria Magdalena und Trinitatis laden ein.
Jeweils von 18:00 bis 18:30 Uhr (Ausnahme siehe Hinweis am Termin) erstrahlt ein geschmücktes Fenster. Stehen bleiben, Lieder singen, Geschichten hören und bei Plätzchen und Glühwein/Tee miteinander ins Gespräch kommen.

Für Fragen und Anregungen können Sie sich gerne an uta.luenebach@netcologne.de wenden.`]
      .filter(Boolean).join('\n\n'),
    url: `https://adventskalender.puk-bonn.de/#/day/${event_data.date}`,
  })
  if (event_data.address && event_data.lat && event_data.lng) {
    event.location({
      title: event_data.address,
      // address: event_data.address,
      radius: 100,
      geo: {
        lat: parseFloat(event_data.lat),
        lon: parseFloat(event_data.lng)
      }
    })
  }
}

const as_ical_file = cal.toString()
writeFileSync(`${__dirname}/public/${calendar_file_name}`, as_ical_file)
