/**
 * A cache for DOM elements
 */
const DOMCache: Record<string, HTMLElement> = {}

export const DOMCacheGetOrSet = (id: string) => {
  const cachedEl = DOMCache[id]
  if (cachedEl) {
    return cachedEl
  }

  const el = document.getElementById(id)

  if (!el) {
    throw new TypeError(`Element with id "${id}" was not found on page?`)
  }

  return DOMCache[id] = el
}

export const DOMCacheHas = (id: string) => DOMCache[id] !== undefined
