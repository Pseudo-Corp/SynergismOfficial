/**
 * A cache for DOM elements
 */
export const DOMCache = new Map<string, HTMLElement>();

export const DOMCacheGetOrSet = (id: string) => {
    const cachedEl = DOMCache.get(id);
    if (cachedEl) return cachedEl;

    const el = document.getElementById(id);
    
    if (!el) {
        throw new TypeError(`Element with id "${id}" was not found on page?`);
    }

    DOMCache.set(id, el);
    return el;
}