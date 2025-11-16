/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: not that bad of a problem */
/** biome-ignore-all assist/source/organizeImports: werd ide config */

import { toCanvas as htmlToImage_toCanvas } from 'html-to-image'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect, useMemo, useRef } from 'react'
import { Icon } from '../components/Icon'
// import useDarkTheme from '../hooks/useDarkTheme'
import { onImagesLoaded } from '../lib/onAllImagesLoaded'

const _PixelRatio_ = 2 // window.devicePixelRatio || 1

// type MarkerFeature = {
//   id: string
//   type: 'Feature'
//   geometry: { type: 'Point'; coordinates: number[] }
//   properties: {
//     entry: TimelineEntry
//     rank: number
//     name: string
//     iconName: string
//     iconWidth?: number
//     iconHeight?: number
//   }
// }

// type MarkerFeatureCollection = {
//   type: 'FeatureCollection'
//   features: MarkerFeature[]
// }

// type CustomIcon = {
//   // documentation at https://maplibre.org/maplibre-gl-js/docs/API/interfaces/StyleImageInterface/
//   width: number
//   height: number
//   data: Uint8ClampedArray
//   context: CanvasRenderingContext2D | null
//   dataChange: boolean
//   onAdd: () => void
//   onRemove: () => void
//   render: () => boolean
// }

// type EntryMarkerProps = {
//   index: number
//   entry: TimelineEntry
//   element: HTMLDivElement | null
//   width: number
//   height: number
//   rerender: boolean
// }

export function ReactMap({
  entries,
  onEntryMarkerClick,
  renderEntryMarker,
}
// : {
//   entries: TimelineEntry[]
//   onEntryMarkerClick: ({ entry }: { entry: TimelineEntry }) => void
//   renderEntryMarker: ({
//     entry,
//     index,
//     ref,
//     onImageLoaded,
//   }: {
//     entry: TimelineEntry
//     index: number
//     ref?: (element: HTMLDivElement | null) => void
//     onImageLoaded?: ({ element }: { element: HTMLDivElement | null }) => void
//   }) => React.ReactNode
// }
) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  // const markersCacheRef = useRef<any[]>([])
  const markerElementRefs = useRef({})

  // const userWantsDarkmode = useDarkTheme()

  useEffect(() => {
    // this useEffect is only called once. all changes to the map must be in other useEffects

    if (map.current) {
      // stops map from intializing more than once
      return
    }

    if (!mapContainer.current) {
      return
    }

    if (!window.alreadySetRTLTextPlugin) {
      maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
        true // Lazy load the plugin
      )
      window.alreadySetRTLTextPlugin = true
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // style: 'https://vector.openstreetmap.org/demo/shortbread/colorful.json',
      // center: [lng, lat],
      // zoom,
      center: [7.07103, 50.72039], // [13.405, 52.52], // [7, 50],
      zoom: 12.7,
      hash: false,
      minZoom: 2.5,
      maxZoom: 22, // A zoom level this high is a bit silly but helps testing
      canvasContextAttributes: {
        antialias: true,
        desynchronized: true,
        // powerPreference: 'high-performance',
      }, // create the gl context with MSAA antialiasing, so custom layers are antialiased
    })

    // map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('style.load', () => {
      if (!map.current || map.current === null) {
        return
      }

      map.current.setProjection({
        type: 'globe', // Set projection to globe
      })
    })
  }, [])

  useEffect(() => {
    if (!map.current || map.current === null) {
      // only change if map exists
      return
    }

    const userWantsDarkmode = false

    const mapStylePath = userWantsDarkmode
      ? 'https://api.maptiler.com/maps/0199b5a8-a337-72d0-8131-30642ac6c1d3/style.json?key=o3zELAXbKePggwdGFWww' // '/map_styles/liberty-dark.json'
      : 'https://api.maptiler.com/maps/0199b5cc-cff4-7175-814c-751f58656516/style.json?key=o3zELAXbKePggwdGFWww' // 'https://tiles.openfreemap.org/styles/liberty' // /map_styles/liberty.json' // https://tiles.openfreemap.org/styles/liberty

    map.current.setStyle(mapStylePath, {
      // The paths in the style are relative, but MapLibre GL JS needs
      // absolute URLs. This is done below, taking the URL of the page
      // for the path. This is because the page could be served on
      // multiple domains, e.g. 127.0.0.1, vector.openstreetmap.org,
      // or a specific server.
      // transformStyle: mapStylePath.startsWith('http') ? undefined : absoluteStyle,
    })
  }, [])

  const entry_zindex = useRef(new Map())
  const htmlMarker = useRef(new Map())
  const clusterMarkers = useRef(new Set())
  const lastHoveredEntryId = useRef('')

  useEffect(() => {
    if (!map.current || map.current === null) {
      // only change if map exists
      return
    }

    const showMarker = async ({
      f,
      entryId,
      isClusterMarker,
    }
    // : {
    //   f: any
    //   entryId: string
    //   isClusterMarker: boolean
    // }
  ) => {
      if (!map.current || map.current === null || !entryId) {
        // only change if map exists
        return
      }

      map.current.getCanvas().style.cursor = 'pointer'

      if (isClusterMarker === false) {
        const marker_element = markerElementRefs.current[entryId]
        if (!marker_element.element) {
          return
        }
        const cloned_marker_element = marker_element.element.cloneNode(true)
        // cloned_marker_element.classList.add('open_marker')

        const el = document.createElement('div')
        // el.innerHTML = `<div class="open_marker">${f.properties.iconSvg}</div>`
        el.style.pointerEvents = 'none'
        el.appendChild(cloned_marker_element)

        await onImagesLoaded(el) // wait for all images to load.

        const newMarker = new maplibregl.Marker({
          element: el,
          anchor: 'center',
          opacityWhenCovered: '0',
          subpixelPositioning: true,
        })
          .setLngLat(f.geometry.coordinates)
          .addTo(map.current)

        const markerId = Math.random().toString(36).substring(2, 15)
        htmlMarker.current.set(markerId, { markerId, entryId, marker: newMarker })

        setTimeout(() => {
          el.classList.add('hover') // start animation
        }, 10)
      } else {
        clusterMarkers.current.add(entryId)
      }

      if (entryId) {
        entry_zindex.current.set(entryId, { zindex: Date.now() })
        setSource() // set-source to update z-index
        map.current.setFeatureState({ source: 'pois', id: entryId }, { hover: true })
        // map.current.triggerRepaint()
      }
    }
    const hideMarker = ({ markerId, entryId }) => {
      if (!map.current || map.current === null) {
        // only change if map exists
        return
      }

      if (entryId && clusterMarkers.current.has(entryId)) {
        // is cluster marker
        if (entryId) {
          map.current.setFeatureState({ source: 'pois', id: entryId }, { hover: false })
          clusterMarkers.current.delete(entryId)
          // map.current.triggerRepaint()
        }
      } else {
        if (!markerId) {
          return
        }

        const thisMarker = htmlMarker.current.get(markerId)
        if (!thisMarker) {
          return
        }

        entryId = thisMarker.entryId

        thisMarker.marker?.getElement().classList.remove('hover') // remove animation

        setTimeout(() => {
          if (entryId) {
            map.current?.setFeatureState({ source: 'pois', id: entryId }, { hover: false })
            // map.current?.triggerRepaint()
          }
          if (thisMarker) {
            thisMarker.marker.remove()
          }
          htmlMarker.current.delete(thisMarker.markerId)
        }, 300)
      }

      map.current.getCanvas().style.cursor = ''
    }
    const hideAllMarkers = () => {
      if (!map.current || map.current === null) {
        // only change if map exists
        return
      }

      // normal markers
      for (const markerId of htmlMarker.current.keys()) {
        hideMarker({ markerId })
      }

      // cluster markers
      for (const entryId of clusterMarkers.current.values()) {
        hideMarker({ entryId })
      }
    }

    const onPoiMousemove = (event) => {
      if (!map.current || map.current === null || event?.features.length === 0) {
        // only change if map exists
        return
      }

      const f =
        (lastHoveredEntryId.current
          ? event?.features.find((f2) => f2.id === lastHoveredEntryId.current)
          : undefined) || event?.features[0]
      const currentHoveredEntryId = f.id

      let isClusterMarker = false
      const layer = f?.layer?.id
      if (layer === 'poi-icons-clusters') {
        isClusterMarker = true
      }

      if (lastHoveredEntryId.current !== currentHoveredEntryId) {
        if (lastHoveredEntryId.current) {
          hideAllMarkers()
        }

        if (currentHoveredEntryId) {
          lastHoveredEntryId.current = currentHoveredEntryId
          showMarker({ f, entryId: currentHoveredEntryId, isClusterMarker })
        }
      }
    }

    const onPoiMouseleave = () => {
      if (!map.current || map.current === null) {
        // only change if map exists
        return
      }

      hideAllMarkers()
      lastHoveredEntryId.current = ''
    }

    const onPoiClick = async (event) => {
      if (!map.current || map.current === null || event?.features.length === 0) {
        // only change if map exists
        return
      }

      const f =
        (lastHoveredEntryId.current
          ? event?.features.find((f2) => f2.id === lastHoveredEntryId.current)
          : undefined) || event?.features[0]

      const layer = f?.layer?.id

      if (layer === 'poi-icons-clusters') {
        // zoom into cluster
        const clusterId = f?.properties?.cluster_id
        const source = map.current.getSource('pois')
        if (source && 'getClusterExpansionZoom' in source) {
          const zoom = await source.getClusterExpansionZoom(clusterId)
          map.current.easeTo({
            center: f?.geometry.coordinates,
            zoom: zoom + 1, // zoom in a bit more
          })
        }
      } else {
        // single marker clicked
        const currentHoveredEntry =
          typeof f.properties.entry === 'string'
            ? JSON.parse(f.properties.entry)
            : f.properties.entry

        onEntryMarkerClick({ entry: currentHoveredEntry })
      }

      hideAllMarkers()
      lastHoveredEntryId.current = ''
    }

    const setSource = () => {
      if (!map.current || map.current === null) {
        // only change if map exists
        return
      }

      const pois = {
        type: 'FeatureCollection',
        features: Object.values(markerElementRefs.current)
          .map(({ width, height, entry }) => {
            const entryId = entry.id
            if (!(entryId && entry.latitude && entry.longitude)) {
              return null
            }

            const iconName = `poi_icon_${entryId}`
            if (!map.current?.hasImage(iconName)) {
              const entryId = entry.id

              const canvasWidth = width * _PixelRatio_
              const canvasHeight = height * _PixelRatio_

              const customIcon = {
                width: canvasWidth,
                height: canvasHeight,
                data: new Uint8ClampedArray(canvasWidth * canvasHeight * 4),
                context: null,
                dataChange: false,

                onAdd() {
                  // nothing needed here
                },

                onRemove() {
                  // nothing needed here
                },

                render() {
                  if (markerElementRefs.current[entryId].rerender === true) {
                    markerElementRefs.current[entryId].rerender = false

                    const elementToRender = markerElementRefs.current[entryId].element
                    if (elementToRender && canvasWidth > 0 && canvasHeight > 0) {
                      // onImagesLoaded(elementToRender).then(() => {}) // wait for all images to load.

                      htmlToImage_toCanvas(elementToRender, {
                        // quality: 100,
                        pixelRatio: 1,
                        canvasWidth,
                        canvasHeight,
                        width,
                        height,
                        cacheBust: false,
                        includeQueryParams: true,
                      })
                        .then((canvas) => {
                          const context = canvas.getContext('2d')
                          if (!context) {
                            throw new Error('Could not get canvas context')
                          }

                          this.context = context
                          this.data = context.getImageData(0, 0, canvasWidth, canvasHeight).data
                          this.dataChange = true

                          // show the icon on the map
                          map.current?.triggerRepaint()
                        })
                        .catch((err) => {
                          // markerElementRefs.current[entryId] = {
                          //   ...markerElementRefs.current[entryId],
                          //   state: 'error',
                          // }
                          console.error('oops, something went wrong!', err)
                        })
                    }
                  }

                  if (this.dataChange === true) {
                    this.dataChange = false
                    return true
                  }

                  return false
                },
              }

              map.current?.addImage(iconName, customIcon, { pixelRatio: _PixelRatio_ })
            }

            return {
              id: entryId,
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [entry.longitude, entry.latitude],
              },
              properties: {
                id: entryId,
                entry,
                rank: entry_zindex.current.get(entryId)?.zindex || 1,
                name: entry.title || '',
                iconName,
                iconWidth: width,
                iconHeight: height,
              },
            }
          })
          .filter((f) => f !== null), // filter out nulls
      }

      const src = map.current.getSource('pois')
      if (src) {
        // already exists; ensure it’s GeoJSON then update
        if ('setData' in src) {
          src.setData(pois)
        } else {
          throw new Error('Source "pois" exists but is not GeoJSON')
        }
      } else {
        map.current.addSource('pois', {
          type: 'geojson',
          data: pois,
          promoteId: 'id',
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)

          // attribution: 'Thomas Rosen',
          // clusterProperties: {
          //   sum: [
          //     ['+', ['accumulated'], ['get', 'sum']],
          //     ['get', 'scalerank'],
          //   ],
          // },
        })
      }
    }

    const addLayers = () => {
      if (!map.current || map.current === null) {
        // only change if map exists
        return
      }

      if (!map.current.getLayer('poi-icons')) {
        map.current.addLayer({
          id: 'poi-icons',
          filter: ['!', ['has', 'point_count']],
          type: 'symbol',
          source: 'pois',
          minzoom: 0,
          layout: {
            'icon-image': ['get', 'iconName'], // per-feature icon
            'icon-allow-overlap': true,
            'icon-size': 1,
            'symbol-sort-key': ['to-number', ['get', 'rank']],
            'text-anchor': 'center',
            'text-field': ['get', 'name'],
            'text-font': ['Ubuntu Medium', 'Noto Sans Medium'],
            'text-line-height': 0.9,
            'text-max-width': 12,
            'text-optional': true,
            'text-padding': 2,
            'text-size': 0, // 16,
            visibility: 'visible',
            'text-justify': 'center',
            'icon-anchor': 'center',
            'icon-text-fit': 'none',
            'text-offset': [0, 0],
            'text-overlap': 'never', // cooperative always never
            'icon-overlap': 'always', // cooperative always never
            'text-pitch-alignment': 'auto',
            'text-rotation-alignment': 'auto',
            'text-ignore-placement': false,
          },
          paint: {
            'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0, 1],
            'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0, 1],
            'text-color': 'hsl(0 0% 100%)',
            'text-halo-blur': ['interpolate', ['linear'], ['zoom'], 12, 1, 14, 0.5, 16, 0],
            'text-halo-color': 'hsl(0 0% 0% / 0.5)',
            'text-halo-width': 2,
          },
        })

        map.current.addLayer({
          id: 'poi-icons-clusters',
          type: 'circle',
          source: 'pois',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': ['step', ['get', 'point_count'], '#222', 100, '#222', 750, '#222'],
            'circle-radius': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              ['step', ['get', 'point_count'], 20, 10, 25, 100, 30, 1000, 35],
              ['step', ['get', 'point_count'], 15, 10, 20, 100, 25, 1000, 30],
            ],
          },
        })

        map.current.addLayer({
          id: 'poi-icons-cluster-count',
          type: 'symbol',
          source: 'pois',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Ubuntu Bold', 'Noto Sans Bold'],
            'text-size': 16,
            'icon-allow-overlap': true,
            visibility: 'visible',
            'text-overlap': 'always', // cooperative always never
            'icon-overlap': 'always', // cooperative always never
          },
          paint: {
            'text-color': '#fff',
            'text-halo-blur': ['interpolate', ['linear'], ['zoom'], 12, 1, 14, 0.5, 16, 0],
            'text-halo-color': 'hsl(0 0% 100% / 0)',
            'text-halo-width': 2,
          },
        })
      }

      map.current.on('mouseenter', 'poi-icons-clusters', onPoiMousemove)
      map.current.on('mousemove', 'poi-icons-clusters', onPoiMousemove)
      map.current.on('mouseleave', 'poi-icons-clusters', onPoiMouseleave)
      map.current.on('click', 'poi-icons-clusters', onPoiClick)

      map.current.on('mouseenter', 'poi-icons', onPoiMousemove)
      map.current.on('mousemove', 'poi-icons', onPoiMousemove)
      map.current.on('mouseleave', 'poi-icons', onPoiMouseleave)
      map.current.on('click', 'poi-icons', onPoiClick)
    }

    if (map.current.loaded()) {
      setSource()
      addLayers()
    } else {
      map.current.on('load', setSource)
      map.current.on('load', addLayers)
    }

    return () => {
      if (!map.current || map.current === null) {
        // only change if map exists
        return
      }

      map.current.off('load', setSource)
      map.current.off('load', addLayers)

      map.current.off('mouseenter', 'poi-icons-clusters', onPoiMousemove)
      map.current.off('mousemove', 'poi-icons-clusters', onPoiMousemove)
      map.current.off('mouseleave', 'poi-icons-clusters', onPoiMouseleave)
      map.current.off('click', 'poi-icons-clusters', onPoiClick)

      map.current.off('mouseenter', 'poi-icons', onPoiMousemove)
      map.current.off('mousemove', 'poi-icons', onPoiMousemove)
      map.current.off('mouseleave', 'poi-icons', onPoiMouseleave)
      map.current.off('click', 'poi-icons', onPoiClick)
    }
  }, [onEntryMarkerClick])

  const entriesRendered = useMemo(() => {
    return entries.map((entry, index) => {
      const entryId = entry?.id
      if (!entryId) {
        return null
      }

      if (!markerElementRefs.current[entryId]) {
        markerElementRefs.current[entryId] = {
          index,
          entry,
          element: null,
          width: 0,
          height: 0,
          rerender: false,
        }
      }

      return (
        <React.Fragment key={entry.id}>
          {renderEntryMarker({
            entry,
            index,
            onImageLoaded: ({ element }) => {
              if (!(element && entryId)) {
                return
              }

              markerElementRefs.current[entryId] = {
                ...markerElementRefs.current[entryId],
                element,
                width: element.offsetWidth,
                height: element.offsetHeight,
                rerender: true,
              }

              // trigger map to rerender with new marker
              map.current?.triggerRepaint()
            },
            ref: (element) => {
              if (!(element && entryId)) {
                return
              }

              markerElementRefs.current[entryId] = {
                ...markerElementRefs.current[entryId],
                element,
                width: element.offsetWidth,
                height: element.offsetHeight,
                rerender: true,
              }

              // trigger map to rerender with new marker
              map.current?.triggerRepaint()
            },
          })}
        </React.Fragment>
      )
    })
  }, [entries, renderEntryMarker])

  const markersAreLoading =
    Object.values(markerElementRefs.current).filter((m) => m.state === 'loading').length > 0

  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
      >{entriesRendered}</div>

      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        ref={mapContainer}
      />

      {markersAreLoading ? (
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            pointerEvents: 'none',
            backgroundColor: 'var(--color-foreground)',
            color: 'var(--color-background)',
            padding: '0.25rem',
            borderRadius: '9999px',
          }}
        >
          <Icon className="animate-spin drop-shadow" name="loading" size="xl" />
        </div>
      ) : null}
    </>
  )
}
