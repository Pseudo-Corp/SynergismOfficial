const MAX_CACHE_SIZE = 1e4

/**
 * A cache for DOM elements
 */
let DOMCache: Record<string, HTMLElement> = {}
let cacheSize = 0

export const DOMCacheGetOrSet = (id: string) => {
  if (cacheSize > MAX_CACHE_SIZE) {
    console.error(`Possible memory leak detected ${cacheSize} dom elements cached`)

    DOMCache = {}
    cacheSize = 0
  }

  const cachedEl = DOMCache[id]
  if (cachedEl) {
    return cachedEl
  }

  const el = document.getElementById(id)

  if (!el) {
    throw new TypeError(`Element with id "${id}" was not found on page?`)
  }

  cacheSize++
  return DOMCache[id] = el
}

export const DOMCacheHas = (id: string) => DOMCache[id] !== undefined
