import { useEffect, useState } from 'react'
import './WaveText.css'

export default function WaveText({ text, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const words = text.split(' ')
  let charCounter = 0

  return (
    <span className={`wave-text ${isLoaded ? 'animate-load' : ''} ${className}`}>
      {words.map((word, wIdx) => {
        return (
          <span key={wIdx} className="wave-word">
            {word.split('').map((char) => {
              const index = charCounter++
              return (
                <span
                  key={index}
                  className="wave-letter"
                  style={{
                    '--char-index': index,
                    '--char-delay': `${index * 0.04}s`
                  }}
                >
                  {char}
                </span>
              )
            })}
            {/* Add a space after the word, unless it is the last word */}
            {wIdx < words.length - 1 && <span className="wave-letter-space">&nbsp;</span>}
          </span>
        )
      })}
    </span>
  )
}
