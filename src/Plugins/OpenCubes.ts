import { player } from '../Synergism'

/**
 * Exposes to the global scope.
 *      @see {openHypercube}
 *      @see {openPlatonic}
 *      @see {openTesseract}
 *      @see {openCube}
 */
export const main = () => {
  Object.defineProperties(window, {
    'openHypercube': {
      value: player.wowHypercubes.open.bind(player.wowHypercubes)
    },
    'openPlatonic': {
      value: player.wowTesseracts.open.bind(player.wowTesseracts)
    },
    'openTeseract': {
      value: player.wowTesseracts.open.bind(player.wowTesseracts)
    },
    'openCube': {
      value: player.wowCubes.open.bind(player.wowCubes)
    }
  })
}
