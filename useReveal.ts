import { useEffect } from 'react'

/**
 * Scroll-triggered reveal: elements with [data-reveal] start blurred/translated
 * (see App.css) and transition in when they enter the viewport.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.style.transitionDelay = el.dataset.revealDelay ?? '0s'
            el.classList.add('is-revealed')
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
