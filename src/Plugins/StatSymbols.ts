import type { PostProcessorModule } from 'i18next'

export const showStatSymbol = true

const KEYWORD_SYMBOLS: Record<string, string> = {
  'Offering': '☤',
  'Obtainium': '❍',
  'Salvage': '♻',
  'Ambrosia Luck': '☘',
  'Red Luck': '⚅',
  'Ambrosia Bar Point': '◊',
  'Red Bar Point': '❖',
  'Blueberries': '☌',
  'Quark': '❂',
  'Cube': '⬢',
  'Tesseract': '⬢',
  'Hypercube': '⬢',
  'Hepteract': '⬢',
  'Octeract': '⬢',
  'Rune Power': '🜇',
  'Blessing Power': '🜆',
  'Spirit Power': '🜈',
  'Talisman Power': 'ל',
  'Rune Coefficient': 'Ɑ',
  'Global Speed': '⧖',
  'Ascension Speed': '⧗',
  'Research': '⚛',
  'Platonic': '✞',
  'Ant ELO': '☇',
  'Immortal ELO': '⛉',
  'Ant Speed': '≫',
  'Ant Sacrifice': '⤬'
}

const reg = new RegExp(Object.keys(KEYWORD_SYMBOLS).join('|'), 'g')

export default {
  type: 'postProcessor',
  name: 'StatSymbols',
  process: (value: string): string => {
    if (!showStatSymbol) {
      return value
    }

    const iterable = value.matchAll(reg)
    let offset = 0

    for (const iter of iterable) {
      value = `${value.substring(0, iter.index + offset)}${KEYWORD_SYMBOLS[iter[0]]} ${
        value.slice(iter.index + offset)
      }`
      // Each time we replace the value, we add 2 characters (space and the symbol) but the indices are based on the original string
      offset += 2
    }

    return value
  }
} satisfies PostProcessorModule
