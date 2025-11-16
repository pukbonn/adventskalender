import { useEffect, useState } from 'react'

export default function useDarkTheme() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(colorSchemeQueryList.matches)

    const handleChange = () => setDarkMode(colorSchemeQueryList.matches)
    colorSchemeQueryList.addEventListener('change', handleChange)

    return () => {
      colorSchemeQueryList.removeEventListener('change', handleChange)
    }
  }, [])

  return darkMode
}
