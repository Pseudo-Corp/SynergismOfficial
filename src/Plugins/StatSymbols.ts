import type { PostProcessorModule } from 'i18next'

export let showStatSymbol = false

export const enableStatSymbols = (): void => {
  showStatSymbol = true
}

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
  'Reborn ELO': '🝘',
  'Ant Speed': '≫',
  'Ant Sacrifice': '⤬',
  'Stage': '⎍'
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
      // Each time we replace the value, we add characters (space and the length of the symbol) but the indices are based on the original string
      offset += 1 + KEYWORD_SYMBOLS[iter[0]].length
      // Fun fact! '🝘' has a length of 2.
    }

    return value
  }
} satisfies PostProcessorModule
