import type { Module } from 'i18next'

export default {
  type: 'postProcessor',
  name: 'ColorText',
  process: (value: string): string => {
    let start = value.indexOf('<<')
    if (start === -1) {
      return value
    }

    let out = ''
    let pos = 0
    while (start !== -1) {
      const bar = value.indexOf('|', start + 2)
      if (bar === -1) {
        break
      }

      const end = value.indexOf('>>', bar + 1)
      if (end === -1) {
        break
      }

      const raw = value.slice(start + 2, bar)
      let name = raw.trim()
      const isHex = name.charCodeAt(0) === 35
      if (!isHex && name.charCodeAt(name.length - 1) === 59) {
        name = name.slice(0, -1).trimEnd()
      }

      let isWord = name.length > (isHex ? 1 : 0)
      for (let i = isHex ? 1 : 0; isWord && i < name.length; i++) {
        const code = name.charCodeAt(i)
        isWord = (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || code === 95 || (code >= 97 && code <= 122)
      }

      let color = raw
      if (isWord) {
        color = isHex
          ? `var(--hex-${name.slice(1).toLowerCase()}-color, ${name})`
          : `var(--${name.toLowerCase()}-color, ${name})`
      }

      out += `${value.slice(pos, start)}<span style="color:${color}">${value.slice(bar + 1, end)}</span>`
      pos = end + 2
      start = value.indexOf('<<', pos)
    }

    return pos === 0 ? value : out + value.slice(pos)
  }
} as Module
