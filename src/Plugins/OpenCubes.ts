import { openHypercube } from '../Hypercubes';
import { openPlatonic } from '../PlatonicCubes';
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
            value: openHypercube
        },
        'openPlatonic': {
            value: openPlatonic
        },
        'openTeseract': {
            value: player.wowTesseracts.open
        },
        'openCube': {
            value: player.wowCubes.open
        }
    });
}
