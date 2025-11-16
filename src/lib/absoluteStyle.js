export function absoluteStyle(_previousStyle, nextStyle) {
  return nextStyle
  // return {
  //   ...nextStyle,
  //   // make relative paths absolute
  //   sprite: [
  //     ...nextStyle.sprite.map((s: any) => {
  //       return {
  //         ...s,
  //         url: s.url, // new URL(s.url, window.location.href).href,
  //       }
  //     }),
  //   ],
  //   // URL will % encode the {} in nextStyle.glyphs, so assemble the URL manually
  //   glyphs: nextStyle.glyphs, // window.location.origin +
  //   sources: {
  //     'versatiles-shortbread': {
  //       ...nextStyle.sources['versatiles-shortbread'],
  //       // tiles: [window.location.origin + nextStyle.sources['versatiles-shortbread'].tiles[0]],
  //       tiles: [
  //         `https://vector.openstreetmap.org${nextStyle.sources['versatiles-shortbread'].tiles[0]}`,
  //       ],
  //     },
  //   },
  // }
}
