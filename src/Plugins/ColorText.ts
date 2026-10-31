import type { Module } from 'i18next'

export default {
  type: 'postProcessor',
  name: 'ColorText',
  process: (value: string): string => {
    if (!value.includes('<<')) {
      return value
    }

    return value
      .replace(
        /(?<!<)<<\s*#(\w+)\s*\|(.*?)>>/g,
        (_, hex: string, text: string) => `<span style="color:var(--hex-${hex.toLowerCase()}-color, #${hex})">${text}</span>`
      )
      .replace(
        /(?<!<)<<\s*(\w+)\s*;?\s*\|(.*?)>>/g,
        (_, color: string, text: string) => `<span style="color:var(--${color.toLowerCase()}-color, ${color})">${text}</span>`
      )
      .replace(/<<(.*?)\|(.*?)>>/g, '<span style="color:$1">$2</span>')
  }
} as Module
