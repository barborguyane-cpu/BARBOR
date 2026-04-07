import { useEffect, useRef } from 'react'

/**
 * Adds 'visible' class when element enters viewport.
 * Use with .reveal / .reveal-left / .reveal-right CSS classes.
 */
export function useReveal() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate the element itself
            entry.target.classList.add('visible')
            // Also animate children with .reveal, .reveal-left, .reveal-right
            entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right')
              .forEach(el => el.classList.add('visible'))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return sectionRef
}
