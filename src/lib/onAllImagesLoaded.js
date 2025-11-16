export function onImagesLoaded(container) {
  return new Promise((resolve) => {
    if (!container) {
      resolve()
      return
    }

    const images = container.querySelectorAll('img')
    let loadedCount = 0

    if (images.length === 0) {
      resolve()
      return
    }

    const checkDone = () => {
      loadedCount++
      if (loadedCount === images.length) {
        resolve()
      }
    }

    for (const img of images) {
      if (img.complete) {
        checkDone()
      } else {
        img.addEventListener('load', checkDone, { once: true })
        img.addEventListener('error', checkDone, { once: true })
      }
    }
  })
}

export function onBackgroundImagesLoaded(container) {
  return new Promise((resolve) => {
    if (!container) {
      resolve()
      return
    }

    // Get image from CSS, assumes single image. For multiple, must iterate.
    const src = window.getComputedStyle(container).backgroundImage
    const urlMatch = src.match(/url\\(["']?(.*?)["']?\\)/)
    if (!urlMatch) {
      // No background-image
      resolve()
      return
    }

    const imageURL = urlMatch[1]

    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => resolve() // Even if loading fails, trigger callback
    img.src = imageURL

    // If already cached
    if (img.complete) {
      resolve()
    }
  })
}

export async function onAllImagesLoaded(container) {
  return await Promise.all([
    onImagesLoaded(container),
    // onBackgroundImagesLoaded(container),
  ])
}
