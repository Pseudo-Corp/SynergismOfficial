import { player } from '../Synergism';

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
            value: player.wowHypercubes.open
        },
        'openPlatonic': {
            value: player.wowTesseracts.open
        },
        'openTeseract': {
            value: player.wowTesseracts.open
        },
        'openCube': {
            value: player.wowCubes.open
        }
    });
}
